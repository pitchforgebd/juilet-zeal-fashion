-- AlterTable
ALTER TABLE `order` MODIFY `paymentMethod` ENUM('COD', 'BKASH', 'NAGAD', 'ROCKET', 'CARD', 'QR') NOT NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `method` ENUM('COD', 'BKASH', 'NAGAD', 'ROCKET', 'CARD', 'QR') NOT NULL;
