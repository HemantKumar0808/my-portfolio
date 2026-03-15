package com.hemantkumar.portfolio.service.impl;

import com.hemantkumar.portfolio.service.EmailValidationService;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.stereotype.Service;

import javax.naming.Context;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import java.util.Hashtable;

@Service
public class EmailValidationServiceImpl implements EmailValidationService {

    private static final EmailValidator validator = EmailValidator.getInstance();

    @Override
    public boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty() || !validator.isValid(email)) {
            return false;
        }

        String domain = email.substring(email.lastIndexOf('@') + 1);

        try {

            Hashtable<String, String> env = new Hashtable<>();
            env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.dns.DnsContextFactory");

            DirContext ctx = new InitialDirContext(env);

            try {
                Attributes attrs = ctx.getAttributes(domain, new String[]{"MX"});
                return attrs != null && attrs.get("MX") != null && attrs.get("MX").size() > 0;
            } finally {
                ctx.close();
            }

        } catch (Exception e) {
            return false;
        }
    }
}