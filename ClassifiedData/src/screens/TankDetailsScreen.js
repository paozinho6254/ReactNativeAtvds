import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, useWindowDimensions, StatusBar } from 'react-native';
import { Image } from 'expo-image';
import { getTankDetails, getTankImageUrl, getTankHtml } from '../services/wikipedia';
import RenderHtml from 'react-native-render-html';

const COLORS = {
  background: '#121212',
  card: '#1E1E1E',
  primaryText: '#EAEAEA',
  secondaryText: '#B0B0B0',
  accent: '#03DAC5',
  link: '#61dafb',
};

const CustomImageRenderer = ({ tnode, contentWidth }) => {
  if (!tnode || !tnode.attributes) {
    console.warn("CustomImageRenderer: tnode ou tnode.attributes é undefined.", tnode);
    return null;
  }

  const { src, alt, width: imgWidth, height: imgHeight } = tnode.attributes;

  if (!src) {
    console.warn("CustomImageRenderer: src da imagem é undefined ou vazio.", tnode.attributes);
    return null;
  }

  const fullSrc = src.startsWith('//') ? `https:${src}` : src;

  const imageSource = {
    uri: fullSrc,
    headers: {
      'User-Agent': 'ClassifiedData/1.0 (https://github.com/paozinho6254/ReactNativeAtvds/ClassifiedData; antoniorochadasilvaa@gmail.com)',
      'Accept': 'image/jpeg, image/png, image/webp',
    },
  };

  let finalWidth = imgWidth ? parseInt(imgWidth, 10) : contentWidth;
  let finalHeight = imgHeight ? parseInt(imgHeight, 10) : 200;

  if (finalWidth > contentWidth) {
    finalHeight = (finalHeight / finalWidth) * contentWidth;
    finalWidth = contentWidth;
  }
  if (finalHeight < 50 && finalWidth > 0) {
    finalHeight = 50;
  }

  return (
    <Image
      key={tnode.domNode.attribs.id || fullSrc}
      source={imageSource}
      style={{
        width: finalWidth,
        height: finalHeight,
        resizeMode: 'contain',
        marginBottom: 10,
        backgroundColor: '#e0e0e0',
        alignSelf: 'center',
      }}
      contentFit="contain"
      onError={(error) => console.error(`Erro ao carregar imagem HTML ${fullSrc}:`, error)}
      cachePolicy="disk"
    />
  );
};

const TankDetailsScreen = ({ route }) => {
  const { tankTitle } = route.params;
  const { width } = useWindowDimensions();
  const [tankData, setTankData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const customRenderers = useCallback(() => ({
    img: (tnode, children, convertedCSSStyles, passProps) => (
      <CustomImageRenderer tnode={tnode} contentWidth={width - 40} {...passProps} />
    ),
  }), [width]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const detailsPromise = getTankDetails(tankTitle);
        const htmlPromise = getTankHtml(tankTitle);

        const [details, html] = await Promise.all([detailsPromise, htmlPromise]);
        console.log("HTML recebido da Wikipedia:", html);
        const topImageUrl = await getTankImageUrl(tankTitle);

        setTankData({ details, html });
        setImageUrl(topImageUrl);
      } catch (error) {
        console.error("Erro ao buscar detalhes do tanque:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [tankTitle]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={{ color: COLORS.secondaryText, marginTop: 10 }}>
          Carregando detalhes do {tankTitle}...
        </Text>
      </View>
    );
  }

  if (!tankData || !tankData.details) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Não foi possível carregar os detalhes para {tankTitle}.</Text>
      </View>
    );
  }

  const tagsStyles = {
    p: { color: COLORS.primaryText, fontSize: 16, lineHeight: 24, marginBottom: 10 },
    h2: { color: COLORS.primaryText, fontSize: 22, fontWeight: 'bold', marginBottom: 10, marginTop: 15, borderBottomWidth: 1, borderBottomColor: COLORS.card, paddingBottom: 5 },
    h3: { color: COLORS.secondaryText, fontSize: 18, fontWeight: 'bold', marginBottom: 8, marginTop: 10 },
    li: { color: COLORS.primaryText, fontSize: 16, lineHeight: 24, marginBottom: 5 },
    ul: { marginBottom: 10, marginLeft: 20 },
    a: { color: COLORS.link, textDecorationLine: 'underline' },
    table: { width: '100%', marginBottom: 15, borderCollapse: 'collapse', color: COLORS.primaryText },
    th: { padding: 8, borderWidth: 1, borderColor: COLORS.card, fontWeight: 'bold', backgroundColor: '#2a2a2a' },
    td: { padding: 8, borderWidth: 1, borderColor: COLORS.card },
  };


  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {imageUrl ? (
        <Image
          source={{
            uri: imageUrl,
            headers: {
              'User-Agent': 'ClassifiedData/1.0 (https://github.com/paozinho6254/ReactNativeAtvds/ClassifiedData; antoniorochadasilvaa@gmail.com)',
              'Accept': 'image/jpeg, image/png, image/webp',
            },
          }}
          style={styles.image}
          contentFit="contain"
          onError={(error) => console.error(`Erro ao carregar imagem em detalhes para ${tankTitle}:`, error)}
          cachePolicy="disk"
        />
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>Imagem não disponível</Text>
        </View>
      )}

      {tankData.html ? (
        <RenderHtml
          contentWidth={width - 40}
          source={{ html: tankData.html }}
          tagsStyles={tagsStyles}
          defaultBaseUrl="https://pt.wikipedia.org/"
          renderers={customRenderers()}
        />
      ) : (
        <Text style={styles.extract}>{tankData.details.extract}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  image: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: COLORS.card,
  },
  extract: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.primaryText,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  noImageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default TankDetailsScreen;