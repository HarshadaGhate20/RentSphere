package com.rentsphere.property.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageServiceImpl
    implements FileStorageService {

    private static final long MAX_FILE_SIZE =
        5L * 1024L * 1024L;

    private static final Set<String>
        ALLOWED_CONTENT_TYPES =
            Set.of(
                "image/jpeg",
                "image/png",
                "image/webp"
            );

    private static final Set<String>
        ALLOWED_EXTENSIONS =
            Set.of(
                "jpg",
                "jpeg",
                "png",
                "webp"
            );

    private final Path uploadRoot;

    public FileStorageServiceImpl(
        @Value("${file.upload-dir}")
        String uploadDirectory
    ) {
        this.uploadRoot =
            Paths.get(uploadDirectory)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(
                this.uploadRoot
            );
        } catch (IOException exception) {
            throw new IllegalStateException(
                "Unable to create the upload directory.",
                exception
            );
        }
    }

    @Override
    public String storePropertyImage(
        MultipartFile file,
        Long propertyId
    ) {
        validateFile(
            file,
            propertyId
        );

        String extension =
            extractExtension(
                file.getOriginalFilename()
            );

        /*
         * Generate our own safe filename.
         *
         * We do not reuse the complete original
         * filename because it can contain unsafe
         * path characters.
         */
        String storedFileName =
            UUID.randomUUID()
                + "."
                + extension;

        Path propertyDirectory =
            uploadRoot
                .resolve(
                    "property_" +
                    propertyId
                )
                .normalize();

        /*
         * Ensure the generated property folder
         * remains inside the configured upload root.
         */
        if (
            !propertyDirectory.startsWith(
                uploadRoot
            )
        ) {
            throw new IllegalArgumentException(
                "Invalid property upload path."
            );
        }

        try {
            Files.createDirectories(
                propertyDirectory
            );

            Path destination =
                propertyDirectory
                    .resolve(
                        storedFileName
                    )
                    .normalize();

            if (
                !destination.startsWith(
                    propertyDirectory
                )
            ) {
                throw new IllegalArgumentException(
                    "Invalid image destination."
                );
            }

            try (
                InputStream inputStream =
                    file.getInputStream()
            ) {
                Files.copy(
                    inputStream,
                    destination,
                    StandardCopyOption
                        .REPLACE_EXISTING
                );
            }

            /*
             * This URL is exposed through WebConfig.
             *
             * React can resolve it as:
             * http://localhost:8080/uploads/...
             */
            return "/uploads/property_"
                + propertyId
                + "/"
                + storedFileName;

        } catch (IOException exception) {
            throw new IllegalStateException(
                "Unable to store property image: "
                    + safeOriginalFilename(file),
                exception
            );
        }
    }

    @Override
    public void deleteFile(
        String imageUrl
    ) {
        if (
            imageUrl == null ||
            imageUrl.isBlank()
        ) {
            return;
        }

        /*
         * Convert:
         *
         * /uploads/property_5/image.jpg
         *
         * into:
         *
         * property_5/image.jpg
         */
        String relativePath =
            imageUrl.trim();

        if (
            relativePath.startsWith(
                "/uploads/"
            )
        ) {
            relativePath =
                relativePath.substring(
                    "/uploads/".length()
                );
        } else if (
            relativePath.startsWith(
                "uploads/"
            )
        ) {
            relativePath =
                relativePath.substring(
                    "uploads/".length()
                );
        }

        Path filePath =
            uploadRoot
                .resolve(relativePath)
                .normalize();

        /*
         * Prevent deletion outside the upload folder.
         */
        if (
            !filePath.startsWith(
                uploadRoot
            )
        ) {
            throw new IllegalArgumentException(
                "Invalid image path."
            );
        }

        try {
            Files.deleteIfExists(
                filePath
            );
        } catch (IOException exception) {
            throw new IllegalStateException(
                "Unable to delete property image.",
                exception
            );
        }
    }

    private void validateFile(
        MultipartFile file,
        Long propertyId
    ) {
        if (propertyId == null) {
            throw new IllegalArgumentException(
                "Property ID is required for image upload."
            );
        }

        if (
            file == null ||
            file.isEmpty()
        ) {
            throw new IllegalArgumentException(
                "Property image cannot be empty."
            );
        }

        if (
            file.getSize() >
            MAX_FILE_SIZE
        ) {
            throw new IllegalArgumentException(
                "Each property image must be 5 MB or smaller."
            );
        }

        String contentType =
            file.getContentType();

        if (
            contentType == null ||
            !ALLOWED_CONTENT_TYPES.contains(
                contentType
                    .toLowerCase(
                        Locale.ROOT
                    )
            )
        ) {
            throw new IllegalArgumentException(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );
        }

        String extension =
            extractExtension(
                file.getOriginalFilename()
            );

        if (
            !ALLOWED_EXTENSIONS.contains(
                extension
            )
        ) {
            throw new IllegalArgumentException(
                "Unsupported image extension."
            );
        }
    }

    private String extractExtension(
        String originalFilename
    ) {
        if (
            originalFilename == null ||
            originalFilename.isBlank()
        ) {
            throw new IllegalArgumentException(
                "Image filename is missing."
            );
        }

        /*
         * Remove any folder path sent by the client.
         *
         * Example:
         * C:\fakepath\photo.jpg
         *
         * becomes:
         * photo.jpg
         */
        String cleanFilename =
            Paths.get(
                originalFilename
            )
            .getFileName()
            .toString();

        int lastDot =
            cleanFilename.lastIndexOf(
                '.'
            );

        if (
            lastDot < 0 ||
            lastDot ==
                cleanFilename.length() - 1
        ) {
            throw new IllegalArgumentException(
                "Image file must have an extension."
            );
        }

        return cleanFilename
            .substring(lastDot + 1)
            .toLowerCase(
                Locale.ROOT
            );
    }

    private String safeOriginalFilename(
        MultipartFile file
    ) {
        String originalFilename =
            file.getOriginalFilename();

        if (
            originalFilename == null ||
            originalFilename.isBlank()
        ) {
            return "unknown file";
        }

        try {
            return Paths
                .get(originalFilename)
                .getFileName()
                .toString();
        } catch (Exception exception) {
            return "unknown file";
        }
    }
}
