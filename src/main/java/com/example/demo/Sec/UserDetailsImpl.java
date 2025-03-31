package com.example.demo.Sec;

import com.example.demo.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

public class UserDetailsImpl implements UserDetails {

    private Long id;
    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private String password;
    private String role;
    private boolean emailVerified; // nouveau champ
    private Integer tokenVersion;
    // Constructeur modifié dans l'ordre : id, nom, prenom, telephone, email, password, role, emailVerified
    public UserDetailsImpl(Long id, String nom, String prenom, String telephone, String email, String password, String role, boolean emailVerified, Integer tokenVersion) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.email = email;
        this.password = password;
        this.role = role;
        this.emailVerified = emailVerified;
        this.tokenVersion = tokenVersion;
    }

    public static UserDetailsImpl build(User user) {
        return new UserDetailsImpl(
                user.getId(),
                user.getNom(),
                user.getPrenom(),
                user.getTelephone(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.isEmailVerified(),
                user.getTokenVersion()// passage de la vérification
        );
    }

    // Getter pour emailVerified
    public boolean isEmailVerified() {
        return emailVerified;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null) {
            return Collections.emptyList();
        }
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
    }

    @Override
    public String getPassword() {
        return password;
    }

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
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public String getTelephone() {
        return telephone;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
    public Integer getTokenVersion() {
        return tokenVersion;
    }
}
