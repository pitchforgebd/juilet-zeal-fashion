import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { qrPaymentDetails } from "@/server/orders/orders";
import { checkoutDefaults } from "@/server/settings/store";

const qrOn = { ...checkoutDefaults, qrEnabled: true, qrImage: "/uploads/qr.png" };

function transactionId(): string {
  return `TST${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1e4)}`;
}

describe("QR payment (requires .env.test's DATABASE_URL)", () => {
  const orderIds: string[] = [];

  /** A placed QR order whose payment carries `trx`, like placeOrder() writes. */
  async function qrOrder(trx: string) {
    const order = await prisma.order.create({
      data: {
        number: `QRT${Date.now()}${Math.floor(Math.random() * 1e4)}`,
        name: "QR Test",
        phone: "01712345678",
        addressLine: "House 1, Road 2, Dhaka",
        area: "INSIDE_DHAKA",
        paymentMethod: "QR",
        subtotal: 1490,
        total: 1560,
        payments: {
          create: {
            method: "QR",
            status: "PENDING",
            amount: 1560,
            gatewayRef: trx,
            payload: { payerNumber: "01819876543", transactionId: trx },
          },
        },
      },
      include: { payments: true },
    });
    orderIds.push(order.id);
    return order;
  }

  afterAll(async () => {
    await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
    await prisma.$disconnect();
  });

  it("stores a QR order with the shopper's proof on the payment", async () => {
    const trx = transactionId();
    const order = await qrOrder(trx);
    expect(order.paymentMethod).toBe("QR");
    expect(order.payments[0]?.gatewayRef).toBe(trx);
    expect(order.payments[0]?.payload).toEqual({
      payerNumber: "01819876543",
      transactionId: trx,
    });
  });

  it("normalises the payer number and transaction ID", async () => {
    const trx = transactionId();
    await expect(
      qrPaymentDetails(
        { qrPayerNumber: "+880 1819-876543", qrTransactionId: ` ${trx.toLowerCase()} ` },
        qrOn,
      ),
    ).resolves.toEqual({ payerNumber: "01819876543", transactionId: trx });
  });

  it("refuses QR orders while QR payment is turned off", async () => {
    await expect(
      qrPaymentDetails(
        { qrPayerNumber: "01819876543", qrTransactionId: transactionId() },
        { ...qrOn, qrEnabled: false },
      ),
    ).rejects.toMatchObject({ status: 400, message: "QR payment is turned off" });
  });

  it("rejects a transaction ID already attached to a live payment, in any case", async () => {
    const trx = transactionId();
    await qrOrder(trx);
    await expect(
      qrPaymentDetails(
        { qrPayerNumber: "01819876543", qrTransactionId: trx.toLowerCase() },
        qrOn,
      ),
    ).rejects.toMatchObject({ status: 409 });
  });

  it("allows the ID again once that payment was marked failed", async () => {
    const trx = transactionId();
    const order = await qrOrder(trx);
    await prisma.payment.update({
      where: { id: order.payments[0]!.id },
      data: { status: "FAILED" },
    });
    await expect(
      qrPaymentDetails({ qrPayerNumber: "01819876543", qrTransactionId: trx }, qrOn),
    ).resolves.toMatchObject({ transactionId: trx });
  });
});
