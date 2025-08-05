import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Linking,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';

const HelpSupportScreen = ({ navigation }) => {
  const { colors } = useTheme();
  
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const faqs = [
    {
      id: 1,
      question: "How does the fire risk prediction work?",
      answer: "Our app uses advanced machine learning algorithms to analyze environmental data including temperature, humidity, wind speed, and historical fire patterns to predict fire risk levels in your area."
    },
    {
      id: 2,
      question: "How accurate are the predictions?",
      answer: "Our predictions are based on real-time sensor data and historical analysis, achieving over 85% accuracy. However, predictions should be used as guidance and not as the sole factor for emergency decisions."
    },
    {
      id: 3,
      question: "What do the different risk levels mean?",
      answer: "Low Risk: Minimal fire danger. Moderate Risk: Elevated fire conditions. High Risk: Dangerous fire conditions. Critical Risk: Extreme fire danger requiring immediate attention."
    },
    {
      id: 4,
      question: "How often should I check the app?",
      answer: "We recommend checking the app at least once daily during fire season. Enable push notifications to receive real-time alerts for changing conditions."
    },
    {
      id: 5,
      question: "Can I use the app offline?",
      answer: "Basic features work offline, but real-time predictions and alerts require an internet connection. We recommend keeping the app updated for the best experience."
    },
    {
      id: 6,
      question: "How do I report a fire emergency?",
      answer: "In case of a fire emergency, immediately call your local emergency services (911 in the US). The app provides risk assessments but is not a substitute for emergency services."
    }
  ];

  const supportOptions = [
    {
      id: 1,
      title: "Email Support",
      subtitle: "Get help via email",
      icon: "mail-outline",
      action: () => Linking.openURL('mailto:support@forestfirepredictor.com')
    },
    {
      id: 2,
      title: "Live Chat",
      subtitle: "Chat with our support team",
      icon: "chatbubble-outline",
      action: () => Alert.alert('Live Chat', 'Live chat feature coming soon!')
    },
    {
      id: 3,
      title: "Phone Support",
      subtitle: "Call our support line",
      icon: "call-outline",
      action: () => Linking.openURL('tel:+1-800-FIRE-HELP')
    },
    {
      id: 4,
      title: "Report a Bug",
      subtitle: "Help us improve the app",
      icon: "bug-outline",
      action: () => Alert.alert('Report Bug', 'Bug reporting feature coming soon!')
    }
  ];

  const tutorials = [
    {
      id: 1,
      title: "Getting Started",
      subtitle: "Learn the basics of the app",
      icon: "play-circle-outline",
      duration: "5 min"
    },
    {
      id: 2,
      title: "Understanding Risk Levels",
      subtitle: "Learn what each risk level means",
      icon: "warning-outline",
      duration: "3 min"
    },
    {
      id: 3,
      title: "Setting Up Alerts",
      subtitle: "Configure notification preferences",
      icon: "notifications-outline",
      duration: "4 min"
    },
    {
      id: 4,
      title: "Using Location Features",
      subtitle: "Set up location-based predictions",
      icon: "location-outline",
      duration: "6 min"
    }
  ];

  const appInfo = {
    version: "1.0.0",
    buildNumber: "2024.1.0",
    lastUpdated: "January 2024",
    developer: "Forest Fire Predictor Team",
    website: "https://forestfirepredictor.com",
    privacyPolicy: "https://forestfirepredictor.com/privacy",
    termsOfService: "https://forestfirepredictor.com/terms"
  };

  const handleContactSupport = (option) => {
    option.action();
  };

  const handleTutorial = (tutorial) => {
    Alert.alert(
      tutorial.title,
      `Would you like to watch the tutorial: "${tutorial.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Watch', onPress: () => Alert.alert('Tutorial', 'Tutorial feature coming soon!') }
      ]
    );
  };

  const handleFAQToggle = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const SupportItem = ({ item, onPress }) => (
    <TouchableOpacity 
      style={[
        styles.supportItem, 
        { 
          backgroundColor: colors.surface,
          shadowColor: colors.shadow
        }
      ]} 
      onPress={onPress}
    >
      <View style={[styles.supportIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name={item.icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.supportContent}>
        <Text style={[styles.supportTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.supportSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

  const TutorialItem = ({ tutorial, onPress }) => (
    <TouchableOpacity 
      style={[
        styles.tutorialItem, 
        { 
          backgroundColor: colors.surface,
          shadowColor: colors.shadow
        }
      ]} 
      onPress={onPress}
    >
      <View style={[styles.tutorialIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name={tutorial.icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.tutorialContent}>
        <Text style={[styles.tutorialTitle, { color: colors.text }]}>{tutorial.title}</Text>
        <Text style={[styles.tutorialSubtitle, { color: colors.textSecondary }]}>{tutorial.subtitle}</Text>
      </View>
      <View style={styles.tutorialMeta}>
        <Text style={[styles.tutorialDuration, { color: colors.textLight }]}>{tutorial.duration}</Text>
        <Ionicons name="play" size={16} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  const FAQItem = ({ faq, isExpanded, onToggle }) => (
    <TouchableOpacity 
      style={[
        styles.faqItem, 
        { 
          backgroundColor: colors.surface,
          shadowColor: colors.shadow
        }
      ]} 
      onPress={onToggle}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={colors.textLight} 
        />
      </View>
      {isExpanded && (
        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.answer}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>
        </View>
        {/* Support Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📞 Contact Support</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Need help? We're here to assist you.
          </Text>
          
          {supportOptions.map(option => (
            <SupportItem 
              key={option.id} 
              item={option} 
              onPress={() => handleContactSupport(option)}
            />
          ))}
        </View>

        {/* Tutorials */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📚 Tutorials</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Learn how to use the app effectively.
          </Text>
          
          {tutorials.map(tutorial => (
            <TutorialItem 
              key={tutorial.id} 
              tutorial={tutorial} 
              onPress={() => handleTutorial(tutorial)}
            />
          ))}
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>❓ Frequently Asked Questions</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Find answers to common questions.
          </Text>
          
          {faqs.map(faq => (
            <FAQItem 
              key={faq.id} 
              faq={faq} 
              isExpanded={expandedFAQ === faq.id}
              onToggle={() => handleFAQToggle(faq.id)}
            />
          ))}
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>ℹ️ App Information</Text>
          
          <View style={[styles.appInfoCard, { backgroundColor: colors.surface }]}>
            <View style={styles.appInfoRow}>
              <Text style={[styles.appInfoLabel, { color: colors.textSecondary }]}>Version:</Text>
              <Text style={[styles.appInfoValue, { color: colors.text }]}>{appInfo.version}</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={[styles.appInfoLabel, { color: colors.textSecondary }]}>Build:</Text>
              <Text style={[styles.appInfoValue, { color: colors.text }]}>{appInfo.buildNumber}</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={[styles.appInfoLabel, { color: colors.textSecondary }]}>Updated:</Text>
              <Text style={[styles.appInfoValue, { color: colors.text }]}>{appInfo.lastUpdated}</Text>
            </View>
            <View style={styles.appInfoRow}>
              <Text style={[styles.appInfoLabel, { color: colors.textSecondary }]}>Developer:</Text>
              <Text style={[styles.appInfoValue, { color: colors.text }]}>{appInfo.developer}</Text>
            </View>
          </View>

          <View style={styles.legalLinks}>
            <TouchableOpacity 
              style={styles.legalLink}
              onPress={() => Linking.openURL(appInfo.website)}
            >
              <Text style={[styles.legalLinkText, { color: colors.primary }]}>Website</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.legalLink}
              onPress={() => Linking.openURL(appInfo.privacyPolicy)}
            >
              <Text style={[styles.legalLinkText, { color: colors.primary }]}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.legalLink}
              onPress={() => Linking.openURL(appInfo.termsOfService)}
            >
              <Text style={[styles.legalLinkText, { color: colors.primary }]}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🚨 Emergency Information</Text>
          
          <View style={[styles.emergencyCard, { backgroundColor: colors.error + '10' }]}>
            <Ionicons name="warning" size={24} color={colors.error} />
            <Text style={[styles.emergencyTitle, { color: colors.error }]}>Emergency Contact</Text>
            <Text style={[styles.emergencyText, { color: colors.textSecondary }]}>
              In case of a fire emergency, immediately call your local emergency services.
            </Text>
            <TouchableOpacity
              style={[styles.emergencyButton, { backgroundColor: colors.error }]}
              onPress={() => Linking.openURL('tel:911')}
            >
              <Text style={[styles.emergencyButtonText, { color: colors.surface }]}>Call 911</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: 'transparent', // Ensure it doesn't interfere with SafeAreaView
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    ...typography.h3,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: 8,
  },
  sectionSubtitle: {
    ...typography.body2,
    marginBottom: 16,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  supportIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    ...typography.body1,
    fontWeight: '600',
  },
  supportSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  tutorialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tutorialIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tutorialContent: {
    flex: 1,
  },
  tutorialTitle: {
    ...typography.body1,
    fontWeight: '600',
  },
  tutorialSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  tutorialMeta: {
    alignItems: 'flex-end',
  },
  tutorialDuration: {
    ...typography.caption,
    marginBottom: 4,
  },
  faqItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    ...typography.body1,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    ...typography.body2,
    marginTop: 12,
    lineHeight: 20,
  },
  appInfoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  appInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  appInfoLabel: {
    ...typography.body2,
    fontWeight: '500',
  },
  appInfoValue: {
    ...typography.body2,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legalLink: {
    paddingVertical: 8,
  },
  legalLinkText: {
    ...typography.body2,
    fontWeight: '600',
  },
  emergencyCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  emergencyTitle: {
    ...typography.body1,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  emergencyText: {
    ...typography.body2,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyButton: {
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emergencyButtonText: {
    ...typography.body2,
    fontWeight: '600',
  },
});

export default HelpSupportScreen; 