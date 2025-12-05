-- CreateTable
CREATE TABLE `StudyGroup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `subject` ENUM('DataStructuresAlgorithms', 'WebDevelopment', 'MachineLearning', 'CompetitiveProgramming', 'MobileDevelopment', 'Other') NOT NULL,
    `owner_id` INTEGER NOT NULL,
    `maxMembers` INTEGER NOT NULL DEFAULT 50,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `StudyGroup_owner_id_idx`(`owner_id`),
    INDEX `StudyGroup_createdAt_idx`(`createdAt`),
    INDEX `StudyGroup_subject_idx`(`subject`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudyGroupMember` (
    `id` VARCHAR(191) NOT NULL,
    `studyGroup_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StudyGroupMember_studyGroup_id_idx`(`studyGroup_id`),
    INDEX `StudyGroupMember_user_id_idx`(`user_id`),
    UNIQUE INDEX `StudyGroupMember_studyGroup_id_user_id_key`(`studyGroup_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resource` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `category` ENUM('Notes', 'PDF', 'PresentationSlides', 'Video', 'Code', 'Other') NOT NULL,
    `subject` VARCHAR(191) NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `uploadedBy_id` INTEGER NOT NULL,
    `downloadCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `studyGroup_id` VARCHAR(191) NULL,

    INDEX `Resource_uploadedBy_id_idx`(`uploadedBy_id`),
    INDEX `Resource_category_idx`(`category`),
    INDEX `Resource_createdAt_idx`(`createdAt`),
    INDEX `Resource_studyGroup_id_idx`(`studyGroup_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `user_id` INTEGER NOT NULL,
    `emailNotifications` BOOLEAN NOT NULL DEFAULT true,
    `inAppNotifications` BOOLEAN NOT NULL DEFAULT true,
    `privateProfile` BOOLEAN NOT NULL DEFAULT false,
    `hideActivity` BOOLEAN NOT NULL DEFAULT false,
    `theme` VARCHAR(191) NOT NULL DEFAULT 'dark',
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudyGroup` ADD CONSTRAINT `StudyGroup_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyGroupMember` ADD CONSTRAINT `StudyGroupMember_studyGroup_id_fkey` FOREIGN KEY (`studyGroup_id`) REFERENCES `StudyGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyGroupMember` ADD CONSTRAINT `StudyGroupMember_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_uploadedBy_id_fkey` FOREIGN KEY (`uploadedBy_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_studyGroup_id_fkey` FOREIGN KEY (`studyGroup_id`) REFERENCES `StudyGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Settings` ADD CONSTRAINT `Settings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
