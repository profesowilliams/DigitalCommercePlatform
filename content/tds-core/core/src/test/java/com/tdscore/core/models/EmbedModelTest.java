package com.tdscore.core.models;

import com.adobe.cq.wcm.core.components.models.Embed;
import com.day.cq.wcm.api.designer.Style;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Field;

import static com.tdscore.core.models.EmbedModel.PN_DESIGN_SCRIPT_DISABLED;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class EmbedModelTest {

    private final AemContext ctx = new AemContext();

    private EmbedModel embedModel;

    @Mock
    Embed embed;

    @Mock
    private Style currentStyle;

    @BeforeEach
    void setUp() {
        embedModel = new EmbedModel();
        Field field = null;
        Field field2 = null;
        try {
            field = embedModel.getClass().getDeclaredField("currentStyle");
            field.setAccessible(true);
            field.set(embedModel, currentStyle);

            field2 = embedModel.getClass().getDeclaredField("type");
            field2.setAccessible(true);
            field2.set(embedModel, "script");

            field2 = embedModel.getClass().getDeclaredField("script");
            field2.setAccessible(true);
            field2.set(embedModel, EXPECTED_JS_SCRIPT);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            log.error("Error occurred in EmbedModelTest setup", e);
        }
        ctx.addModelsForClasses(EmbedModel.class);

    }

    @Test
    void validateForJScript() {
        when(currentStyle.get(PN_DESIGN_SCRIPT_DISABLED, false)).thenReturn(false);
        embedModel.initModel();
        assertEquals(EXPECTED_JS_SCRIPT, embedModel.getScript());
    }

    private static final String EXPECTED_JS_SCRIPT = "<script type=\"text/javascript\">if (!window.AdButler){(function(){var s = document.createElement(\"script\"); s.async = true; s.type = \"text/javascript\";s.src = 'https://servedbyadbutler.com/app.js';var n = document.getElementsByTagName(\"script\")[0]; n.parentNode.insertBefore(s, n);}());}</script>\n" +
            "<script type=\"text/javascript\">\n" +
            "var AdButler = AdButler || {}; AdButler.ads = AdButler.ads || [];\n" +
            "var abkw = window.abkw || '';\n" +
            "var plc214424 = window.plc214424 || 0;\n" +
            "document.write('<'+'div id=\"placement_214424_'+plc214424+'\"></'+'div>');\n" +
            "AdButler.ads.push({handler: function(opt){ AdButler.register(168525, 214424, [226,200], 'placement_214424_'+opt.place, opt); }, opt: { place: plc214424++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});\n" +
            "</script>";
    private static final Logger log = LoggerFactory.getLogger(EmbedModelTest.class);
    @Test
    void testgetCode(){
        assertEquals(null,embedModel.getCode());
    }
    @Test
    void testgetScripturl(){
        assertEquals(null,embedModel.getScripturl());
    }
    @Test
    void testgetHtml(){
        assertEquals(null,embed.getHtml());
    }
    @Test
    void testgetEmbeddableResourceType(){
        assertEquals(null,embed.getEmbeddableResourceType());
    }
    @Test
    void testgetUrl(){
        assertEquals(null,embed.getUrl());
    }
    @Test
    void testgetExportedTypes() {
        assertEquals(null,embed.getExportedType());
    }
}