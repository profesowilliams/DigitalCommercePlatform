package com.tdscore.core.models;

import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.components.Component;
import com.day.cq.wcm.api.components.ComponentManager;
import com.day.text.Text;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

import java.util.Optional;

/**
 * Defines an {@code Item} class, used by the children editor {@code Editor} Sling Model.
 *
 * @since com.adobe.cq.wcm.core.components.commons.editor.dialog.childreneditor 1.0.0
 */
public class TabItem {

    protected String name;
    protected String value;
    protected String title;
    protected String iconName;
    protected String iconPath;
    protected String iconAbbreviation;
    protected String link;
    protected String linkPath;

    /**
     * Name of the resource property that defines a panel title
     */
    static final String PN_PANEL_TITLE = "cq:panelTitle";

    /**
     * Name of the resource property that defines a component icon
     */
    static final String PN_ICON = "cq:icon";

    /**
     * Name of the resource property that defines a two letter component abbreviation
     */
    static final String PN_ABBREVIATION = "abbreviation";

    /**
     * Name of the resource property that defines a translation context for the component abbreviation
     */
    static final String PN_ABBREVIATION_I18N = "abbreviation_commentI18n";

    /**
     * Name of a component child node that defines an icon in PNG format
     */
    static final String NN_ICON_PNG = "cq:icon.png";

    /**
     * Name of a component child node that defines an icon in SVG format
     */
    static final String NN_ICON_SVG = "cq:icon.svg";

    public TabItem(){}

    public TabItem(SlingHttpServletRequest request, Resource resource) {
        String translationContext = null;
        String titleI18n = null;
        I18n i18n = new I18n(request);
        populateAttributes(resource);

        ComponentManager componentManager = request.getResourceResolver().adaptTo(ComponentManager.class);
        if (componentManager != null ) {
            Component component = componentManager.getComponentOfResource(resource);
            titleI18n = populateTitle(component, i18n);
            translationContext = populateIconData(component);
        }

        if (iconAbbreviation != null && !"".equals(iconAbbreviation) && translationContext != null) {
            iconAbbreviation = i18n.getVar(iconAbbreviation, translationContext);
        } else if ((iconName == null && iconAbbreviation == null && iconPath == null) || "".equals(iconAbbreviation)) {
            // build internationalized abbreviation from title: Image >> Im
            iconAbbreviation = titleI18n == null ? title : titleI18n;

            if (iconAbbreviation.length() >= 2) {
                iconAbbreviation = iconAbbreviation.substring(0, 2);
            } else if (iconAbbreviation.length() == 1) {
                iconAbbreviation = String.valueOf(iconAbbreviation.charAt(0));
            }
        }
    }

    private void populateAttributes(Resource resource) {
        if (resource != null) {
            name = resource.getName();
            ValueMap vm = resource.getValueMap();
            value = Optional.ofNullable(vm.get(PN_PANEL_TITLE, String.class))
                    .orElseGet(() -> vm.get(JcrConstants.JCR_TITLE, String.class));
            link = Optional.ofNullable(vm.get("link", String.class))
                    .orElse(StringUtils.EMPTY);
            linkPath = Optional.ofNullable(vm.get("linkPath", String.class))
                    .orElse(StringUtils.EMPTY);
        }
    }

    private String populateIconData(Component component) {
        String translationContext = null;
        while (component != null) {
            Resource res = component.adaptTo(Resource.class);
            if (res != null) {
                ValueMap valueMap = res.getValueMap();
                iconName = valueMap.get(PN_ICON, String.class);
                if (iconName != null) {
                    break;
                }
                iconAbbreviation = valueMap.get(PN_ABBREVIATION, String.class);
                if (iconAbbreviation != null) {
                    translationContext = valueMap.get(PN_ABBREVIATION_I18N, String.class);
                    break;
                }
                Resource png = res.getChild(NN_ICON_PNG);
                if (png != null) {
                    iconPath = png.getPath();
                    break;
                }
                Resource svg = res.getChild(NN_ICON_SVG);
                if (svg != null) {
                    iconPath = svg.getPath();
                    break;
                }

            }
            component = component.getSuperComponent();
        }
        return translationContext;
    }

    private String populateTitle(Component component, I18n i18n) {
        String titleI18n = null;
        if (component != null) {
            title = component.getTitle();
            titleI18n = i18n.getVar(title);
            if (title == null) {
                title = Text.getName(component.getPath());
            }

        }
        return titleI18n;
    }

    /**
     * Retrieves the node name of this children editor item.
     *
     * @return the {@code Item} name
     */
    public String getName() {
        return name;
    }

    /**
     * Retrieves the value ({@code jcr:title}) of this children editor item.
     *
     * @return the {@code Item} value
     */
    public String getValue() {
        return value;
    }

    /**
     * Retrieves the title (component name) of this children editor item.
     *
     * @return the {@code Item} title
     */
    public String getTitle() {
        return title;
    }

    /**
     * Retrieves the icon name of this children editor item.
     *
     * @return the {@code Item} icon name
     */
    public String getIconName() {
        return iconName;
    }

    /**
     * Retrieves the icon path of this children editor item.
     *
     * @return the {@code Item} icon path
     */
    public String getIconPath() {
        return iconPath;
    }

    /**
     * Retrieves the icon abbreviation of this children editor item.
     *
     * @return the {@code Item} icon abbreviation
     */
    public String getIconAbbreviation() {
        return iconAbbreviation;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getLinkPath() {
        return linkPath;
    }

    public void setLinkPath(String linkPath) {
        this.linkPath = linkPath;
    }
}
