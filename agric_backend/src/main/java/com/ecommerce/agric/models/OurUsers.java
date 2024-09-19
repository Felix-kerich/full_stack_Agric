package com.ecommerce.agric.models;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "ourusers")
@Data
public class OurUsers extends Auditable<String> implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String email;
    private String name;
    private String password;
    private String city;
    private String role;

    @Column(name = "is_payment_made", nullable = false, columnDefinition = "boolean default false")
    private Boolean isPaymentMade = false;

    @Column(name = "is_account_verified", nullable = false, columnDefinition = "boolean default false")
    private boolean isAccountVerified = false; // Default to false

    @Column(name = "login_disabled", nullable = false, columnDefinition = "boolean default true")
    private boolean loginDisabled = true; // Default to true

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @OneToMany(mappedBy = "user")
    private Set<SecureToken> tokens;

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !loginDisabled;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isAccountVerified;
    }
}
