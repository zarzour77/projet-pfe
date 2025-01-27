package com.example.Trade_For_Talent.Sec;

import com.example.Trade_For_Talent.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.Trade_For_Talent.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String mail) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(mail)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with mail: " + mail));
        return UserDetailsImpl.build(user);
    }
}
