package com.tdscore.core.models;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Objects;
import java.util.Optional;

import javax.annotation.PostConstruct;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(
        adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class ExtractBinaryAsset {

  private static final Logger log = LoggerFactory.getLogger(ExtractBinaryAsset.class);

  private static final String FILE_REFERENCE_PN = "fileReference";

  @Self
  private Resource resource;

  private Asset asset;

  @PostConstruct
  protected void init() {

    this.asset = Optional.ofNullable(this.resource)
            .map(fileResource -> fileResource.getValueMap().get(FILE_REFERENCE_PN, String.class))
            .map(fileReference -> this.resource.getResourceResolver().getResource(fileReference))
            .map(fileResource -> fileResource.adaptTo(Asset.class))
            .orElse(null);

    log.debug("resource path is {}", resource!=null ? resource.getPath() : "is null");

    log.debug("is asset null ? {}", this.asset == null);
  }

  public InputStream getBinary() {
    if (Objects.nonNull(asset)) {
      final Rendition rendition = asset.getOriginal();
      return rendition.getStream();
    }
    return null;
  }

  public String getPath() {
    return this.asset.getPath();
  }
}
