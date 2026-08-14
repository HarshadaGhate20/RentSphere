package com.rentsphere.property.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "property_photos")
public class PropertyPhoto {

    /* =========================================================
       PRIMARY KEY
    ========================================================= */

    @Id
    @GeneratedValue(
        strategy = GenerationType.IDENTITY
    )
    private Long id;

    /* =========================================================
       PROPERTY RELATIONSHIP
    ========================================================= */

    @JsonIgnore
    @ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
    )
    @JoinColumn(
        name = "property_id",
        nullable = false
    )
    private Property property;

    /* =========================================================
       IMAGE URL

       Database column:
       image_url

       Examples:
       /uploads/property_7/abc.jpeg
       /uploads/property_6/abc.png
    ========================================================= */

    @Column(
        name = "image_url",
        nullable = false,
        length = 500
    )
    private String imageUrl;

    /* =========================================================
       COVER IMAGE
    ========================================================= */

    @Column(
        name = "cover_image",
        nullable = false
    )
    private Boolean coverImage = false;

    /* =========================================================
       DISPLAY ORDER
    ========================================================= */

    @Column(
        name = "display_order",
        nullable = false
    )
    private Integer displayOrder = 0;

    /* =========================================================
       CONSTRUCTOR
    ========================================================= */

    public PropertyPhoto() {
    }

    /* =========================================================
       DEFAULT VALUES
    ========================================================= */

    @PrePersist
    public void beforeCreate() {

        if (coverImage == null) {
            coverImage = false;
        }

        if (displayOrder == null) {
            displayOrder = 0;
        }

        if (imageUrl != null) {
            imageUrl = imageUrl.trim();
        }
    }

    @PreUpdate
    public void beforeUpdate() {

        if (coverImage == null) {
            coverImage = false;
        }

        if (displayOrder == null) {
            displayOrder = 0;
        }

        if (imageUrl != null) {
            imageUrl = imageUrl.trim();
        }
    }

    /* =========================================================
       GETTERS / SETTERS
    ========================================================= */

    public Long getId() {
        return id;
    }

    public void setId(
        Long id
    ) {
        this.id = id;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(
        Property property
    ) {
        this.property = property;
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