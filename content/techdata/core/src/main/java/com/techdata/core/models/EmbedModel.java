package com.techdata.core.models;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.models.Embed;
import com.adobe.cq.wcm.core.components.services.embed.UrlProcessor;
import com.day.cq.wcm.api.designer.Style;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

import javax.annotation.PostConstruct;

@Model(adaptables = SlingHttpServletRequest.class, adapters = {Embed.class,
        ComponentExporter.class}, resourceType = EmbedModel.RESOURCE_TYPE, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class EmbedModel implements ComponentExporter, Embed {

    protected static final String RESOURCE_TYPE = "techdata/components/embed/v1/embed";
    protected static final String PN_DESIGN_SCRIPT_DISABLED = "scriptDisabled";
    private Type embedType;

    @Self
    @Via(type = ResourceSuperType.class)
    private Embed embed;

    @ValueMapValue
    @Via("resource")
    private String type;

    @ValueMapValue
    @Via("resource")
    private String script;

    @ValueMapValue
    @Via("resource")
    private String scripturl;

    @ValueMapValue
    @Via("resource")
    private String code;

    @ScriptVariable
    private Style currentStyle;

    @Override
    public String getExportedType() {
        return embed.getExportedType();
    }

    public Type getEType() {
        return embedType;
    }

    @Override
    public String getUrl() {
        return embed.getUrl();
    }

    @Override
    public UrlProcessor.Result getResult() {
        return embed.getResult();
    }

    @Override
    public String getEmbeddableResourceType() {
        return embed.getEmbeddableResourceType();
    }

    @Override
    public String getHtml() {
        return embed.getHtml();
    }

    public String getScript() {
        return script;
    }

    public String getScripturl() {
        return scripturl;
    }

    public String getCode() {
        return code;
    }

    @PostConstruct
    protected void initModel() {

        embedType = Type.fromString(type);
        if (embedType == null || embedType != Type.SCRIPT) {
            script = null;
        }
        if (embedType == null || embedType != Type.EMBEDDABLE) {
            scripturl = null;
            code = null;
        }
        if (currentStyle != null) {
            boolean scriptDisabled = currentStyle.get(PN_DESIGN_SCRIPT_DISABLED, false);
            if (scriptDisabled) {
                script = null;
            }
        }
    }

    enum Type {
        URL("url"), EMBEDDABLE("embeddable"), HTML("html"), SCRIPT("script");

        private final String value;

        Type(String value) {
            this.value = value;
        }

        public static Type fromString(String value) {
            for (Type type : values()) {
                if (type.value.equals(value)) {
                    return type;
                }
            }
            return null;
        }
    }
}
