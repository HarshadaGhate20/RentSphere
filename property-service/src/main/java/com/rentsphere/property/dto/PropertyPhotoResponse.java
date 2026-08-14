package com.rentsphere.property.dto;

public class PropertyPhotoResponse {

    private Long id;

    private String imageUrl;

    private Boolean coverImage;

    private Integer displayOrder;

    public PropertyPhotoResponse() {
    }

    public PropertyPhotoResponse(
            Long id,
            String imageUrl,
            Boolean coverImage,
            Integer displayOrder
    ) {

        this.id = id;
        this.imageUrl = imageUrl;
        this.coverImage = coverImage;
        this.displayOrder = displayOrder;
    }

    public Long getId() {
        return id;
    }

    public void setId(
            Long id
    ) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(
            String imageUrl
    ) {
        this.imageUrl = imageUrl;
    }

    public Boolean getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(
            Boolean coverImage
    ) {
        this.coverImage = coverImage;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(
            Integer displayOrder
    ) {
        this.displayOrder = displayOrder;
    }
}