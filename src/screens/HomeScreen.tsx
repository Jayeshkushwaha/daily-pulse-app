import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

  const navigateToQuestionnaire = () => {
    navigation.navigate('Questionnaire' as never);
  };

  const navigateToSettings = () => {
    // Settings functionality can be added later
    console.log('Settings pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={navigateToSettings}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>👤</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Sophia</Text>
            <Text style={styles.userDetails}>24, Female</Text>
          </View>
        </View>

        {/* Questionnaire Card */}
        <View style={styles.questionnaireCard}>
          <View style={styles.cardImageContainer}>
            <View style={styles.cardImage}>
              <Text style={styles.cardImageIcon}>📋</Text>
            </View>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Daily Questionnaire</Text>
            <Text style={styles.cardDescription}>
              Complete your daily questionnaire to track your progress and get personalized insights.
            </Text>
            
            <TouchableOpacity 
              style={styles.startButton}
              onPress={navigateToQuestionnaire}
            >
              <Text style={styles.startButtonText}>Start Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  settingsIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d4a574',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 16,
    color: '#9ca3af',
  },
  questionnaireCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  cardImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardImage: {
    width: 120,
    height: 80,
    backgroundColor: '#d4a574',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageIcon: {
    fontSize: 40,
  },
  cardContent: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#4ade80',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;

