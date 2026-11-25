import { describe, expect, it } from "vitest";
import { checkoutSchema as adminCheckoutSchema } from "@/lib/validation/admin-settings";
import { checkoutSchema } from "@/lib/validation/customer";

const base = {
  name: "Ayesha Rahman",
  phone: "01712345678",
  email: "",
  address: "House 12, Road 4, Dhanmondi, Dhaka",
  area: "inside-dhaka" as const,
};

function issuePaths(input: unknown): string[] {
  const result = checkoutSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
}

describe("checkout schema — QR payment", () => {
  it("accepts a QR order with a payer number and transaction ID", () => {
    expect(
      issuePaths({
        ...base,
        paymentMethod: "qr",
        qrPayerNumber: "01819876543",
        qrTransactionId: "BKH7Q2X9LM",
      }),
    ).toEqual([]);
  });

  it("requires both QR fields when paying by QR", () => {
    expect(issuePaths({ ...base, paymentMethod: "qr" })).toEqual([
      "qrPayerNumber",
      "qrTransactionId",
    ]);
  });

  it("rejects a payer number that isn't a BD mobile", () => {
    expect(
      issuePaths({
        ...base,
        paymentMethod: "qr",
        qrPayerNumber: "12345",
        qrTransactionId: "BKH7Q2X9LM",
      }),
    ).toEqual(["qrPayerNumber"]);
  });

  it("rejects transaction IDs that are too short or contain spaces", () => {
    for (const qrTransactionId of ["AB12", "BKH7 Q2X9", "trx-12345"]) {
      expect(
        issuePaths({
          ...base,
          paymentMethod: "qr",
          qrPayerNumber: "01819876543",
          qrTransactionId,
        }),
      ).toEqual(["qrTransactionId"]);
    }
  });

  it("ignores the QR fields for other payment methods", () => {
    expect(issuePaths({ ...base, paymentMethod: "cod" })).toEqual([]);
    expect(issuePaths({ ...base, paymentMethod: "card", qrTransactionId: "x" })).toEqual(
      [],
    );
  });
});

describe("admin checkout settings — QR payment", () => {
  const settings = {
    inside: 70,
    outside: 130,
    freeFrom: 6500,
    guest: true,
    minOrder: 0,
    cod: true,
    orderPrefix: "JZ",
    qrEnabled: false,
    qrImage: "",
    qrAccount: "",
    qrNote: "",
  };

  it("can't switch QR on without a QR image", () => {
    const result = adminCheckoutSchema.safeParse({ ...settings, qrEnabled: true });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["qrImage"]);
  });

  it("allows QR on once an image is uploaded", () => {
    expect(
      adminCheckoutSchema.safeParse({
        ...settings,
        qrEnabled: true,
        qrImage: "/uploads/qr-bkash.png",
      }).success,
    ).toBe(true);
  });
});
