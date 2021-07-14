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
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(
  adaptables = SlingHttpServletRequest.class,
  defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class ExtractSVGModel {

  private static final Logger LOG = LoggerFactory.getLogger(VendorListItem.class);


  private static final String FILE_REFERENCE_PN = "fileReference";
  private static final String SVG_EXTENSION = ".svg";

  @Self
  private SlingHttpServletRequest request;

  private Asset asset;

  @PostConstruct
  protected void init() {
    this.asset = Optional.ofNullable(this.request.getResource())
      .map(imageResource -> imageResource.getValueMap().get(FILE_REFERENCE_PN, String.class))
      .map(fileReference -> this.request.getResourceResolver().getResource(fileReference))
      .map(resource -> resource.adaptTo(Asset.class))
      .orElse(null);
  }

  public boolean isSvg() {
    if (Objects.nonNull(asset)) {
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
      LOG.error("Unable to read the SVG's XML from InputStream: ", e);
    }
    return strBuilder.toString();
  }
}
