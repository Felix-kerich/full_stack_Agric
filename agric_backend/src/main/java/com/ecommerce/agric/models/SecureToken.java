package com.ecommerce.agric.models;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;  
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp; 

@Entity
@Table(name = "secure_token")
@AllArgsConstructor
@NoArgsConstructor
public class SecureToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String token;

    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp timeStamp; 

    @Column(updatable = false)
    @Basic(optional = false)
    private LocalDateTime expireAt; 

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private OurUsers user;

    // Transient because expiration is computed dynamically
    @Transient
    private boolean isExpired;   


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Timestamp getTimeStamp() {
        return this.timeStamp;
    }

    public void setTimeStamp(Timestamp timeStamp) {
        this.timeStamp = timeStamp;
    }

    public LocalDateTime getExpireAt() {
        return this.expireAt;
    }

    public void setExpireAt(LocalDateTime expireAt) {
        this.expireAt = expireAt;
    }

    public OurUsers getUser() {
        return this.user;
    }

    public void setUser(OurUsers user) {
        this.user = user;
    }

    public boolean isExpired() {
        return getExpireAt().isBefore(LocalDateTime.now());
    }

    public boolean getIsExpired() {
        return this.isExpired;
    }

    public void setIsExpired(boolean isExpired) {
        this.isExpired = isExpired;
    }

}
