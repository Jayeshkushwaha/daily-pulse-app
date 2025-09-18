import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';

interface Question {
  id: string;
  question: string;
  type: 'text' | 'single_choice' | 'multi_choice';
  options?: string[];
}

interface Answer {
  questionId: string;
  answer: string | string[];
}

const QuestionnaireScreen = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://dummyjson.com/c/a67f-05a6-4cbd-9a19');
      const data = await response.json();
      
      if (data && data.questions) {
        setQuestions(data.questions);
        // Initialize answers array
        const initialAnswers = data.questions.map((q: Question) => ({
          questionId: q.id,
          answer: q.type === 'multi_choice' ? [] : '',
        }));
        setAnswers(initialAnswers);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      Alert.alert('Error', 'Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev =>
      prev.map(a =>
        a.questionId === questionId ? { ...a, answer } : a
      )
    );
  };

  const handleTextInput = (questionId: string, value: string) => {
    updateAnswer(questionId, value);
  };

  const handleSingleChoice = (questionId: string, value: string) => {
    updateAnswer(questionId, value);
  };

  const handleMultiChoice = (questionId: string, value: string) => {
    const currentAnswer = answers.find(a => a.questionId === questionId)?.answer as string[] || [];
    const newAnswer = currentAnswer.includes(value)
      ? currentAnswer.filter(v => v !== value)
      : [...currentAnswer, value];
    updateAnswer(questionId, newAnswer);
  };

  const saveAnswers = async () => {
    if (!user) return;

    // Validate that all questions are answered
    const unansweredQuestions = answers.filter(a => {
      if (Array.isArray(a.answer)) {
        return a.answer.length === 0;
      }
      return !a.answer || a.answer.trim() === '';
    });

    if (unansweredQuestions.length > 0) {
      Alert.alert('Incomplete', 'Please answer all questions before saving.');
      return;
    }

    setSaving(true);
    try {
      const date = new Date().toISOString().split('T')[0];
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('answers')
        .doc(date)
        .set({
          answers,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });

      Alert.alert('Success', 'Your answers have been saved!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving answers:', error);
      Alert.alert('Error', 'Failed to save answers. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const currentAnswer = answers.find(a => a.questionId === question.id)?.answer;

    switch (question.type) {
      case 'text':
        return (
          <TextInput
            style={styles.textInput}
            value={currentAnswer as string || ''}
            onChangeText={(value) => handleTextInput(question.id, value)}
            placeholder="Enter your answer..."
            placeholderTextColor="#6b7280"
            multiline
          />
        );

      case 'single_choice':
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  currentAnswer === option && styles.selectedOption
                ]}
                onPress={() => handleSingleChoice(question.id, option)}
              >
                <View style={[
                  styles.radioButton,
                  currentAnswer === option && styles.selectedRadio
                ]} />
                <Text style={[
                  styles.optionText,
                  currentAnswer === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'multi_choice':
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option, index) => {
              const isSelected = (currentAnswer as string[] || []).includes(option);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption
                  ]}
                  onPress={() => handleMultiChoice(question.id, option)}
                >
                  <View style={[
                    styles.checkbox,
                    isSelected && styles.selectedCheckbox
                  ]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ade80" />
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Questionnaire</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {questions.map((question, index) => (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.questionNumber}>Question {index + 1}</Text>
            <Text style={styles.questionText}>{question.question}</Text>
            {renderQuestion(question)}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={saveAnswers}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text style={styles.saveButtonText}>Save Answers</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    fontSize: 24,
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 16,
    fontSize: 16,
  },
  questionContainer: {
    marginVertical: 24,
  },
  questionNumber: {
    fontSize: 14,
    color: '#4ade80',
    fontWeight: '600',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 16,
    lineHeight: 24,
  },
  textInput: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#4b5563',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  selectedOption: {
    borderColor: '#4ade80',
    backgroundColor: '#1f2937',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6b7280',
    marginRight: 12,
  },
  selectedRadio: {
    borderColor: '#4ade80',
    backgroundColor: '#4ade80',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6b7280',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckbox: {
    borderColor: '#4ade80',
    backgroundColor: '#4ade80',
  },
  checkmark: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  selectedOptionText: {
    color: '#4ade80',
  },
  saveButton: {
    backgroundColor: '#4ade80',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 32,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuestionnaireScreen;

