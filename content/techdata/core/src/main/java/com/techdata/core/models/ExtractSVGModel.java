package com.techdata.core.models;

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
import org.apache.sling.api.SlingHttpServletRequest;
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
public class ExtractSVGModel {

  private static final Logger log = LoggerFactory.getLogger(ExtractSVGModel.class);


  private static final String FILE_REFERENCE_PN = "fileReference";
  private static final String SVG_EXTENSION = ".svg";

  @Self
  private Resource resource;

  private Asset asset;

  @PostConstruct
  protected void init() {
    log.debug("inside init");

    this.asset = Optional.ofNullable(this.resource)
      .map(imageResource -> imageResource.getValueMap().get(FILE_REFERENCE_PN, String.class))
      .map(fileReference -> this.resource.getResourceResolver().getResource(fileReference))
      .map(resource -> resource.adaptTo(Asset.class))
      .orElse(null);

    log.debug("resource path is {}", resource!=null ? resource.getPath() : "is null");


    log.debug("is asset null ? {}", this.asset == null);
  }

  public boolean isSvg() {
    if (Objects.nonNull(asset)) {
      log.debug("StringUtils.contains(asset.getPath(), SVG_EXTENSION) {} {}", this.asset.getPath(), StringUtils.contains(asset.getPath(), SVG_EXTENSION));
      return StringUtils.contains(asset.getPath(), SVG_EXTENSION);
    }
    return false;
  }

  public String getBinary() {
    if (Objects.nonNull(asset)) {
      final Rendition rendition = asset.getOriginal();
      final InputStream stream = rendition.getStream();
      return readXml(stream);
    }
    return StringUtils.EMPTY;
  }

  private String readXml(final InputStream content) {
    String readLine;
    final BufferedReader br = new BufferedReader(new InputStreamReader(content));
    final StringBuilder strBuilder = new StringBuilder();

    try {
      while (((readLine = br.readLine()) != null)) {
        strBuilder.append(readLine);
      }
    } catch (IOException e) {
      log.error("Unable to read the SVG's XML from InputStream: ", e);
    }
    return strBuilder.toString();
  }

  public String getPath() {
    return this.asset.getPath();
  }
}
