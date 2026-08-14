package com.rentsphere.booking.dto;

public class PropertyPhotoResponse {

    private Long id;
    private String imageUrl;
    private Boolean coverImage;
    private Integer displayOrder;

    public PropertyPhotoResponse() {
    }

    
 // Generate getters and setters.
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public Boolean getCoverImage() {
		return coverImage;
	}

	public void setCoverImage(Boolean coverImage) {
		this.coverImage = coverImage;
	}

	public Integer getDisplayOrder() {
		return displayOrder;
	}

	public void setDisplayOrder(Integer displayOrder) {
		this.displayOrder = displayOrder;
	}

    
    
}