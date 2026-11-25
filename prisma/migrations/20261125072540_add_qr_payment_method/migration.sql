-- AlterTable
ALTER TABLE `Order` MODIFY `paymentMethod` ENUM('COD', 'BKASH', 'NAGAD', 'ROCKET', 'CARD', 'QR') NOT NULL;

-- AlterTable
ALTER TABLE `Payment` MODIFY `method` ENUM('COD', 'BKASH', 'NAGAD', 'ROCKET', 'CARD', 'QR') NOT NULL;
