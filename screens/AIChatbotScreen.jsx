import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";

import { ThemeContext } from "../theme/ThemeContext";
import { typography } from "../theme/typography";
//import Config from "react-native-config";
// import { GEMINI_API_KEY } from "../expo-env";

const AIChatbotScreen = () => {
  const { colors } = useContext(ThemeContext);
  const headerHeight = useHeaderHeight();

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your AI Fire Safety Assistant. Ask me anything about forest fires, prevention, or evacuation.",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fadeAnim: new Animated.Value(1),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}-${Math.random()}`,
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fadeAnim: new Animated.Value(0),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const prompt = `You are a helpful fire safety assistant. Respond to the user's query: "${inputText}". Provide a concise and clear answer. Use markdown for formatting, like bolding key terms and using bullet points (e.g., "* Point 1"). Keep the response helpful and focused on fire safety.`;
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      };

      const apiKey = "AIzaSyB-o-0rZ1S3dcjuun-KuQWKWMSyo7LwE38";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error Response:", errorBody);
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      const text =
        result?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "⚠️ Sorry, I could not generate a response. Please try again.";

      const aiMsg = {
        id: `ai-${Date.now()}-${Math.random()}`,
        text,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        fadeAnim: new Animated.Value(0),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Failed to send message:", err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        text: "❌ Something went wrong. Please check your connection or API key.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        fadeAnim: new Animated.Value(0),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} colors={colors} />
          ))}
          {isTyping && <TypingIndicator colors={colors} />}
        </ScrollView>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: colors.background, color: colors.text },
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about fire safety..."
            placeholderTextColor={colors.textLight}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim()
                  ? colors.primary
                  : colors.textLight,
              },
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? "white" : colors.text}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Sub-components
const MessageBubble = ({ message, colors }) => {
  useEffect(() => {
    const animation = Animated.timing(message.fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [message.fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.messageBubbleContainer,
        message.isUser ? styles.userBubbleContainer : styles.aiBubbleContainer,
        { opacity: message.fadeAnim },
      ]}
    >
      {!message.isUser && (
        <View style={[styles.aiIcon, { backgroundColor: colors.surface }]}>
          <Ionicons name="sparkles" size={16} color={colors.primary} />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          message.isUser
            ? { backgroundColor: colors.primary }
            : { backgroundColor: colors.surface },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isUser ? { color: "white" } : { color: colors.text },
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            message.isUser
              ? { color: "white", opacity: 0.7 }
              : { color: colors.textLight },
          ]}
        >
          {message.timestamp}
        </Text>
      </View>
    </Animated.View>
  );
};

const TypingIndicator = ({ colors }) => (
  <View style={[styles.messageBubbleContainer, styles.aiBubbleContainer]}>
    <View style={[styles.aiIcon, { backgroundColor: colors.surface }]}>
      <Ionicons name="sparkles" size={16} color={colors.primary} />
    </View>
    <View style={[styles.typingContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.typingText, { color: colors.textSecondary }]}>
        AI is typing
      </Text>
      <View style={styles.typingDots}>
        <View style={[styles.dot, { backgroundColor: colors.textLight }]} />
        <View style={[styles.dot, { backgroundColor: colors.textLight }]} />
        <View style={[styles.dot, { backgroundColor: colors.textLight }]} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  messagesContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubbleContainer: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "85%",
  },
  userBubbleContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  aiBubbleContainer: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  aiIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    alignSelf: "flex-end",
    marginBottom: -4,
  },
  messageBubble: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  messageText: { ...typography.body2, lineHeight: 22 },
  timestamp: {
    ...typography.caption,
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 6,
    opacity: 0.8,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  typingText: { ...typography.caption, marginRight: 8 },
  typingDots: { flexDirection: "row" },
  dot: { width: 5, height: 5, borderRadius: 2.5, marginHorizontal: 1.5 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    marginRight: 12,
    maxHeight: 100,
    ...typography.body2,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AIChatbotScreen;
