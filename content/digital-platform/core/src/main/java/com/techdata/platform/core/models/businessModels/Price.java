package com.techdata.platform.core.models.businessModels;

public class Price {

  public Price(Number value, String currency) {
    this.value = value;
    this.currency = currency;
  }

  private String currency;
  private Number value;

  public String getCurrency() {
    return currency;
  }

  public Number getValue() {
    return value;
  }
}
