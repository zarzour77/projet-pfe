package com.example.demo.Payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponsePayment {
    private Result result;
    private int code;
    private String name;
    private String version;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Result {
        private String link;
        private String payment_id;
        private String developer_tracking_id;
        private Boolean success;
    }
}
