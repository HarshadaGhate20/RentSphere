package com.rentsphere.payment.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.stereotype.Component;

@Component
public class ReceiptNumberGenerator {

    public String generate() {

        String date = LocalDate.now()
                .format(
                    DateTimeFormatter.BASIC_ISO_DATE
                );

        String randomPart = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 10)
                .toUpperCase();

        return "RSP-" + date + "-" + randomPart;
    }
}