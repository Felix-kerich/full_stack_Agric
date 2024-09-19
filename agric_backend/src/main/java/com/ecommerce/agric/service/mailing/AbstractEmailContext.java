package com.ecommerce.agric.service.mailing;

import java.util.HashMap;
import java.util.Map;

public abstract class AbstractEmailContext {
    private String from;
    private String to;
    private String subject;
    private String email;
    private String attachment;
    private String fromDisplayName;
    private String emailLanguage;
    private String displayName;
    private String templateLocation;
    private String body; // New field to hold the email body content
    private Map<String, Object> context;

    public AbstractEmailContext() {
        this.context = new HashMap<>();
    }

    public <T> void init(T context) {
        // We can do any common configuration setup here,
        // like setting up some base URL and context
    }

    // Getter and Setter for `from`
    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    // Getter and Setter for `to`
    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    // Getter and Setter for `subject`
    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    // Getter and Setter for `email`
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // Getter and Setter for `context`
    public Map<String, Object> getContext() {
        return context;
    }

    public void setContext(Map<String, Object> context) {
        this.context = context;
    }

    // Method to put a key-value pair in the context map
    public Object put(String key, Object value) {
        return key == null ? null : this.context.put(key.intern(), value);
    }

    // Getter and Setter for `templateLocation`
    public String getTemplateLocation() {
        return templateLocation;
    }

    public void setTemplateLocation(String templateLocation) {
        this.templateLocation = templateLocation;
    }

    // Getter and Setter for `attachment`
    public String getAttachment() {
        return attachment;
    }

    public void setAttachment(String attachment) {
        this.attachment = attachment;
    }

    // Getter and Setter for `fromDisplayName`
    public String getFromDisplayName() {
        return fromDisplayName;
    }

    public void setFromDisplayName(String fromDisplayName) {
        this.fromDisplayName = fromDisplayName;
    }

    // Getter and Setter for `emailLanguage`
    public String getEmailLanguage() {
        return emailLanguage;
    }

    public void setEmailLanguage(String emailLanguage) {
        this.emailLanguage = emailLanguage;
    }

    // Getter and Setter for `displayName`
    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    // Getter and Setter for `body` (newly added field)
    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
