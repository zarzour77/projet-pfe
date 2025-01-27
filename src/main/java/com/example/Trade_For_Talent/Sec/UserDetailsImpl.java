package com.example.Trade_For_Talent.Sec;
import com.example.Trade_For_Talent.Entity.User;
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

    public UserDetailsImpl(Long id, String nom, String prenom, String telephone, String email, String password, String role) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public static UserDetailsImpl build(User user) {
        return new UserDetailsImpl(
                user.getId(),
                user.getNom(),
                user.getPrenom(),
                user.getTelephone(),
                user.getEmail(),
                user.getPassword(),
                user.getRole()
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Single role, so return just that one authority
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + this.role.toUpperCase()));
    }


    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;  // Or username if you prefer
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Always true for simplicity
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Always true for simplicity
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Always true for simplicity
    }

    @Override
    public boolean isEnabled() {
        return true; // Always true for simplicity
    }

    // Getters and setters for additional fields

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
}
