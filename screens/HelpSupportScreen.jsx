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
import { showInfoToast } from '../services/toastService';

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
      action: () => {
        showInfoToast('Live chat feature coming soon!');
      }
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
      action: () => {
        showInfoToast('Bug reporting feature coming soon!');
      }
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
      title: "Setting Up Notifications",
      subtitle: "Configure your alert preferences",
      icon: "notifications-outline",
      duration: "4 min"
    },
    {
      id: 4,
      title: "Using Location Services",
      subtitle: "Set up location-based alerts",
      icon: "location-outline",
      duration: "3 min"
    }
  ];

  const handleContactSupport = (option) => {
    try {
      option.action();
    } catch (error) {
      console.error('Error contacting support:', error);
      showInfoToast('Unable to open support option. Please try again.');
    }
  };

  const handleTutorial = (tutorial) => {
    showInfoToast(`${tutorial.title} tutorial coming soon!`);
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
        <Ionicons name="play-circle-outline" size={20} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  const FAQItem = ({ faq, isExpanded, onToggle }) => (
    <View style={[styles.faqItem, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
      <TouchableOpacity 
        style={styles.faqHeader} 
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.faqQuestionContainer}>
          <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
        </View>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={colors.primary} 
        />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.faqAnswerContainer}>
          <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.answer}</Text>
        </View>
      )}
    </View>
  );

  const SectionHeader = ({ title, subtitle }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
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

        {/* Contact Support */}
        <View style={styles.section}>
          <SectionHeader 
            title="📞 Contact Support" 
            subtitle="Get help from our support team"
          />
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
          <SectionHeader 
            title="📚 Tutorials" 
            subtitle="Learn how to use the app effectively"
          />
          {tutorials.map(tutorial => (
            <TutorialItem 
              key={tutorial.id} 
              tutorial={tutorial} 
              onPress={() => handleTutorial(tutorial)}
            />
          ))}
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <SectionHeader 
            title="❓ Frequently Asked Questions" 
            subtitle="Find answers to common questions"
          />
          {faqs.map(faq => (
            <FAQItem 
              key={faq.id} 
              faq={faq} 
              isExpanded={expandedFAQ === faq.id}
              onToggle={() => handleFAQToggle(faq.id)}
            />
          ))}
        </View>

        {/* Emergency Information */}
        <View style={styles.section}>
          <SectionHeader 
            title="🚨 Emergency Information" 
            subtitle="Important safety information"
          />
          <View style={[styles.emergencyCard, { backgroundColor: colors.highRisk + '10', borderColor: colors.highRisk + '30' }]}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="warning" size={24} color={colors.highRisk} />
              <Text style={[styles.emergencyTitle, { color: colors.highRisk }]}>Emergency Contact</Text>
            </View>
            <Text style={[styles.emergencyText, { color: colors.text }]}>
              In case of a fire emergency, immediately call your local emergency services:
            </Text>
            <TouchableOpacity
              style={[styles.emergencyButton, { backgroundColor: colors.highRisk }]}
              onPress={() => Linking.openURL('tel:911')}
            >
              <Ionicons name="call" size={20} color={colors.surface} />
              <Text style={[styles.emergencyButtonText, { color: colors.surface }]}>Call 911</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <SectionHeader 
            title="ℹ️ App Information" 
            subtitle="About the Forest Fire Predictor"
          />
          <View style={[styles.infoCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Version 1.0.0</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Forest Fire Predictor helps you stay informed about fire risks in your area using advanced machine learning and real-time environmental data.
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              This app is designed to provide early warning systems and should not replace official emergency services or evacuation orders.
            </Text>
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
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    ...typography.h2,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...typography.caption,
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
    marginBottom: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionContainer: {
    flex: 1,
  },
  faqQuestion: {
    ...typography.body1,
    fontWeight: '600',
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswer: {
    ...typography.body2,
    lineHeight: 20,
  },
  emergencyCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emergencyTitle: {
    ...typography.body1,
    fontWeight: '700',
    marginLeft: 8,
  },
  emergencyText: {
    ...typography.body2,
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 12,
  },
  emergencyButtonText: {
    ...typography.body2,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoTitle: {
    ...typography.body1,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    ...typography.body2,
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default HelpSupportScreen; 