<?php

class ProfileImage
{
    public function validate(?array $imageFile): bool
    {
        if (!isset($imageFile) || !isset($imageFile['error'])) {
            return true;
        }

        if ($imageFile['error'] === UPLOAD_ERR_NO_FILE) {
            return true;
        }

        if ($imageFile['error'] !== UPLOAD_ERR_OK) {
            return false;
        }

        $allowedTypes = ['image/png', 'image/jpeg'];
        $fileType = mime_content_type($imageFile['tmp_name']);
        if (!in_array($fileType, $allowedTypes)) {
            return false;
        }

        $extension = strtolower(pathinfo($imageFile['name'], PATHINFO_EXTENSION));
        $allowedExtensions = ['png', 'jpg', 'jpeg'];
        return in_array($extension, $allowedExtensions);
    }

    public function save(?array $imageFile, ?string $currentImage = null): ?string
    {
        if (!$imageFile || !isset($imageFile['error']) || $imageFile['error'] === UPLOAD_ERR_NO_FILE) {
            return $currentImage;
        }

        $uploadDirFs = __DIR__ . '/../views/uploads/profile_pics';

        $extension = strtolower(pathinfo($imageFile['name'], PATHINFO_EXTENSION));
        $fileName = uniqid('profile_', true) . '.' . $extension;
        $targetFs = $uploadDirFs . '/' . $fileName;

        if (move_uploaded_file($imageFile['tmp_name'], $targetFs)) {
            return 'uploads/profile_pics/' . $fileName;
        }

        return $currentImage;
    }
}
