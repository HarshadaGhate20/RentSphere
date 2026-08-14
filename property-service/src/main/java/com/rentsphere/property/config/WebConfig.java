package com.rentsphere.property.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final Path uploadRoot;

    public WebConfig(@Value("${file.upload-dir}") String uploadDirectory) {
        this.uploadRoot = Paths.get(uploadDirectory).toAbsolutePath().normalize();
    }

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry
    ) {

        registry
            .addResourceHandler("/uploads/**")
            .addResourceLocations(
                    uploadRoot.toUri().toString()
            );
    }
}
