import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGoals } from '../context/GoalContext';
import { useAuth } from '../context/AuthContext';

const MOOD_STORAGE_KEY = '@daily_mood';

const motivationalQuotes = [
  "Every day is a new beginning. Take a deep breath and start again.",
  "Believe you can and you're halfway there.",
  "Small progress is still progress. Keep going!",
  "Your only limit is you.",
  "Dream big. Start small. Act now.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "You are stronger than you think.",
  "Progress, not perfection.",
  "The only way to do great work is to love what you do.",
  "Believe in yourself and all that you are.",
  "You don't have to be great to start, but you have to start to be great.",
  "The future depends on what you do today.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "It's going to be hard, but hard does not mean impossible.",
  "Great things never come from comfort zones.",
  "Don't wish for it. Work for it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't wait for opportunity. Create it.",
  "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
  "The key to success is to focus on goals, not obstacles.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never came from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success is what comes after you stop making excuses.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard does not mean impossible.",
  "Don't stop until you're proud.",
  "Work hard in silence. Let success make the noise.",
  "The struggle you're in today is developing the strength you need tomorrow.",
  "Don't be afraid to fail. Be afraid not to try.",
  "Your limitation—it's only your imagination.",
  "Sometimes later becomes never. Do it now.",
  "The difference between ordinary and extraordinary is that little extra.",
  "You are capable of amazing things.",
  "Difficult roads often lead to beautiful destinations.",
  "Be stronger than your excuses.",
  "A little progress each day adds up to big results.",
  "Don't count the days. Make the days count.",
  "You didn't come this far to only come this far.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Strive for progress, not perfection.",
  "Don't limit your challenges. Challenge your limits.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Excuses don't burn calories.",
  "Sweat is fat crying.",
  "The only bad workout is the one that didn't happen.",
  "Your health is an investment, not an expense.",
  "Take care of your body. It's the only place you have to live.",
  "A healthy outside starts from the inside.",
  "The groundwork for all happiness is good health.",
  "To keep the body in good health is a duty.",
  "Health is wealth.",
  "An apple a day keeps the doctor away.",
  "Early to bed and early to rise makes a man healthy, wealthy, and wise.",
  "The greatest wealth is health.",
  "He who has health has hope, and he who has hope has everything.",
  "A fit body, a calm mind, a house full of love. These things cannot be bought.",
  "Reading is to the mind what exercise is to the body.",
  "Education is the most powerful weapon which you can use to change the world.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Live as if you were to die tomorrow. Learn as if you were to live forever.",
  "An investment in knowledge pays the best interest.",
  "The more that you read, the more things you will know.",
  "Education is not preparation for life; education is life itself.",
  "Learning never exhausts the mind.",
  "The expert in anything was once a beginner.",
  "Study while others are sleeping; work while others are loafing.",
  "Don't let what you cannot do interfere with what you can do.",
  "The only person you should try to be better than is the person you were yesterday.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "You are what you do, not what you say you'll do.",
  "If it doesn't challenge you, it won't change you.",
  "Make each day your masterpiece.",
  "The only impossible journey is the one you never begin.",
  "What we think, we become.",
  "Whether you think you can or you think you can't, you're right.",
  "I am not a product of my circumstances. I am a product of my decisions.",
  "The mind is everything. What you think you become.",
  "80% of success is showing up.",
  "Either you run the day or the day runs you.",
  "We may encounter many defeats but we must not be defeated.",
  "Whether you think you can or think you can't, you're right.",
  "Security is mostly a superstition. Life is either a daring adventure or nothing.",
  "The only person you are destined to become is the person you decide to be.",
  "Go confidently in the direction of your dreams.",
  "Everything you've ever wanted is on the other side of fear.",
  "We can easily forgive a child who is afraid of the dark. The real tragedy is adults who are afraid of the light.",
  "Nothing will work unless you do.",
  "I never dreamed about success. I worked for it.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "It is never too late to be what you might have been.",
  "If you're going through hell, keep going.",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
  "Believe and act as if it were impossible to fail.",
  "Definiteness of purpose is the starting point of all achievement.",
  "We generate fears while we sit. We overcome them by action.",
  "Whether you think you can or think you can't, you're right.",
  "I have not failed. I've just found 10,000 ways that won't work.",
  "A person who never made a mistake never tried anything new.",
  "The person who says it cannot be done should not interrupt the person who is doing it.",
  "There are no traffic jams along the extra mile.",
  "It is never too late to be what you might have been.",
  "You become what you believe.",
  "I would rather die of passion than of boredom.",
  "A truly rich man is one whose children run into his arms when his hands are empty.",
  "It is not what you do for your children, but what you have taught them to do for themselves.",
  "Build your own dreams, or someone else will hire you to build theirs.",
  "The battles that count aren't the ones for gold medals. The struggles within yourself are the toughest.",
  "Education costs money. But then so does ignorance.",
  "I have learned over the years that when one's mind is made up, this diminishes fear.",
  "It does not matter how slowly you go as long as you do not stop.",
  "If you look at what you have in life, you'll always have more.",
  "Remember that not getting what you want is sometimes a wonderful stroke of luck.",
  "You can't use up creativity. The more you use, the more you have.",
  "Do what you feel in your heart to be right, for you'll be criticized anyway.",
  "What is the point of being alive if you don't at least try to do something remarkable.",
  "Life is not measured by the number of breaths we take, but by the moments that take our breath away.",
  "Everything has beauty, but not everyone can see.",
  "When I let go of what I am, I become what I might be.",
  "Life is 10% what happens to me and 90% of how I react to it.",
  "An unexamined life is not worth living.",
  "Eighty percent of success is showing up.",
  "Your time is limited, so don't waste it living someone else's life.",
  "Winning isn't everything, but wanting to win is.",
  "I am not a product of my circumstances. I am a product of my decisions.",
  "Every child is an artist. The problem is how to remain an artist once he grows up.",
  "You can never cross the ocean until you have the courage to lose sight of the shore.",
  "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.",
  "Either you run the day, or the day runs you.",
  "Whether you think you can or you think you can't, you're right.",
  "The two most important days in your life are the day you are born and the day you find out why.",
  "Whatever you can do, or dream you can, begin it. Boldness has genius, power and magic in it.",
  "The best revenge is massive success.",
  "People often say that motivation doesn't last. Well, neither does bathing. That's why we recommend it daily.",
  "Life shrinks or expands in proportion to one's courage.",
  "If you hear a voice within you say you cannot paint, then by all means paint and that voice will be silenced.",
  "There is only one way to avoid criticism: do nothing, say nothing, and be nothing.",
  "Ask and it will be given to you; search, and you will find; knock and the door will be opened for you.",
  "The only person you are destined to become is the person you decide to be.",
  "Believe you can and you're halfway there.",
  "Too many of us are not living our dreams because we are living our fears.",
  "Challenges are what make life interesting and overcoming them is what makes life meaningful.",
  "If you want to lift yourself up, lift up someone else.",
  "I have been impressed with the urgency of doing. Knowing is not enough; we must apply.",
  "Limitations live only in our minds. But if we use our imaginations, our possibilities become limitless.",
  "You take your life in your own hands, and what happens? A terrible thing, no one to blame.",
  "What's money? A man is a success if he gets up in the morning and goes to bed at night and in between does what he wants to do.",
  "I didn't fail the test. I just found 100 ways to do it wrong.",
  "In order to succeed, your desire for success should be greater than your fear of failure.",
  "A person who never made a mistake never tried anything new.",
  "The person who says it cannot be done should not interrupt the person who is doing it.",
  "There are no traffic jams along the extra mile.",
  "It is never too late to be what you might have been.",
  "You become what you believe.",
  "The only impossible journey is the one you never begin.",
  "Start where you are. Use what you have. Do what you can.",
];

interface GoalCardProps {
  goalId: string;
  icon: string;
  title: string;
  category: 'popular' | 'new';
  onPress: () => void;
  onQuickAdd: (goalId: string, amount: number) => void;
}

const GoalCard = ({ goalId, icon, title, category, onPress, onQuickAdd }: GoalCardProps) => {
  const getQuickAmount = () => {
    switch (goalId) {
      case 'water': return 0.5;
      case 'study': return 15;
      case 'savings': return 500;
      case 'running': return 10;
      case 'exercise': return 10;
      default: return 1;
    }
  };

  return (
    <View style={styles.goalCard}>
      <TouchableOpacity onPress={onPress} style={styles.goalCardMain}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.goalTitle}>{title}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.quickAddButton}
        onPress={() => onQuickAdd(goalId, getQuickAmount())}
      >
        <Text style={styles.quickAddText}>+ Quick Add</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function Home({ navigation }: any) {
  const { goals, incrementProgress, getProgressPercentage, getBadges } = useGoals();
  const { user } = useAuth();
  const [dailyQuote, setDailyQuote] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationGoal, setCelebrationGoal] = useState<any>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodMessage, setMoodMessage] = useState('');
  const [todayMood, setTodayMood] = useState<string | null>(null);

  useEffect(() => {
    // Set daily quote based on date
    const today = new Date().getDate();
    setDailyQuote(motivationalQuotes[today % motivationalQuotes.length]);
    loadTodayMood();
  }, []);

  const loadTodayMood = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stored = await AsyncStorage.getItem(MOOD_STORAGE_KEY);
      if (stored) {
        const moodData = JSON.parse(stored);
        if (moodData.date === today) {
          setTodayMood(moodData.mood);
        }
      }
    } catch (error) {
      console.error('Error loading mood:', error);
    }
  };

  const saveMood = async (mood: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify({ date: today, mood }));
      setTodayMood(mood);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const getMoodResponse = (mood: string) => {
    const responses: { [key: string]: { message: string; suggestion: string } } = {
      '😊': {
        message: "That's wonderful! Your positive energy is contagious!",
        suggestion: "Keep this momentum going! Maybe share your happiness with someone today."
      },
      '😄': {
        message: "Amazing! You're radiating joy today!",
        suggestion: "This is a great day to tackle your goals. You've got the energy!"
      },
      '😐': {
        message: "It's okay to have neutral days. Every day doesn't have to be perfect.",
        suggestion: "Try doing something small that usually makes you smile. Maybe a short walk or your favorite music?"
      },
      '😔': {
        message: "I'm sorry you're feeling down. Remember, this feeling is temporary.",
        suggestion: "Be gentle with yourself today. Maybe try some light exercise or talk to someone you trust. You're not alone."
      },
      '😢': {
        message: "It's okay to not be okay. Your feelings are valid.",
        suggestion: "Take it easy today. Do something comforting - watch something you love, rest, or reach out to a friend. Tomorrow is a new day."
      },
      '😴': {
        message: "Feeling tired? Rest is just as important as being productive.",
        suggestion: "Listen to your body. Maybe take a short nap, go to bed early tonight, or just take things slower today."
      },
      '😤': {
        message: "Feeling frustrated is normal. Take a deep breath.",
        suggestion: "Channel that energy into something productive. Exercise can help release tension. Or take a break and come back refreshed."
      },
    };
    return responses[mood] || responses['😐'];
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    const response = getMoodResponse(mood);
    setMoodMessage(`${response.message}\n\n💡 ${response.suggestion}`);
    saveMood(mood);
    setTimeout(() => {
      setShowMoodPicker(false);
      setSelectedMood(null);
      setMoodMessage('');
    }, 5000);
  };

  const popularGoals = goals.filter(g => g.category === 'popular');
  const newGoals = goals.filter(g => g.category === 'new');

  const handleGoalPress = (goalId: string) => {
    navigation.navigate('GoalDetail', { goalId });
  };

  const handleQuickAdd = (goalId: string, amount: number) => {
    const previousPercentage = getProgressPercentage(goalId);
    incrementProgress(goalId, amount);
    
    // Check if goal just completed
    setTimeout(() => {
      const newPercentage = getProgressPercentage(goalId);
      if (previousPercentage < 100 && newPercentage >= 100) {
        const goal = goals.find(g => g.id === goalId);
        setCelebrationGoal(goal);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }, 100);
  };

  const handleUndo = () => {
    undoLastAction();
  };

  const userName = user?.name || 'User';
  const badges = getBadges();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustration}>📱</Text>
        </View>
        <Text style={styles.greeting}>Hello, <Text style={styles.name}>{userName}</Text></Text>
        <Text style={styles.subtitle}>Start improving your life.</Text>
        <Text style={styles.chooseText}>choose your goals!</Text>
      </View>

      {/* Mood Checker */}
      <TouchableOpacity 
        style={styles.moodCard} 
        onPress={() => setShowMoodPicker(true)}
      >
        <Text style={styles.moodIcon}>
          {todayMood || '😊'}
        </Text>
        <View style={styles.moodTextContainer}>
          <Text style={styles.moodTitle}>How are you feeling?</Text>
          <Text style={styles.moodSubtitle}>
            {todayMood ? 'Tap to change your mood' : 'Tap to share your mood'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Motivational Quote */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteIcon}>💭</Text>
        <Text style={styles.quoteText}>{dailyQuote}</Text>
      </View>

      {/* Badges Section */}
      {badges.length > 0 && (
        <View style={styles.badgesSection}>
          <Text style={styles.badgesTitle}>🏆 Your Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {badges.map((badge, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular</Text>
        </View>
        <View style={styles.goalsRow}>
          {popularGoals.slice(0, 2).map(goal => (
            <GoalCard
              key={goal.id}
              goalId={goal.id}
              icon={goal.icon}
              title={goal.title}
              category={goal.category}
              onPress={() => handleGoalPress(goal.id)}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New</Text>
        </View>
        <View style={styles.goalsRow}>
          {newGoals.slice(0, 2).map(goal => (
            <GoalCard
              key={goal.id}
              goalId={goal.id}
              icon={goal.icon}
              title={goal.title}
              category={goal.category}
              onPress={() => handleGoalPress(goal.id)}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </View>
      </View>

      {/* Mood Picker Modal */}
      <Modal
        visible={showMoodPicker}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.moodPickerCard}>
            {selectedMood ? (
              <>
                <Text style={styles.selectedMoodEmoji}>{selectedMood}</Text>
                <Text style={styles.moodResponseText}>{moodMessage}</Text>
              </>
            ) : (
              <>
                <Text style={styles.moodPickerTitle}>How are you feeling today?</Text>
                <View style={styles.moodOptions}>
                  <TouchableOpacity onPress={() => handleMoodSelect('😊')}>
                    <Text style={styles.moodOption}>😊</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMoodSelect('😄')}>
                    <Text style={styles.moodOption}>😄</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMoodSelect('😐')}>
                    <Text style={styles.moodOption}>😐</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMoodSelect('😔')}>
                    <Text style={styles.moodOption}>😔</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMoodSelect('😢')}>
                    <Text style={styles.moodOption}>😢</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMoodSelect('😴')}>
                    <Text style={styles.moodOption}>😴</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleMoodSelect('😤')}>
                    <Text style={styles.moodOption}>😤</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowMoodPicker(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Celebration Modal */}
      <Modal
        visible={showCelebration}
        transparent
        animationType="fade"
      >
        <View style={styles.celebrationOverlay}>
          <View style={styles.celebrationCard}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.celebrationTitle}>Goal Completed!</Text>
            <Text style={styles.celebrationText}>
              You've completed your {celebrationGoal?.title} goal!
            </Text>
            <Text style={styles.celebrationSubtext}>Keep up the amazing work!</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#B8D8F0',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  illustrationContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  illustration: {
    fontSize: 120,
  },
  greeting: {
    fontSize: 28,
    color: '#666',
    marginBottom: 5,
  },
  name: {
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  chooseText: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#999',
  },
  goalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalCardMain: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD4D4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  quickAddButton: {
    backgroundColor: '#B8D8F0',
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 5,
  },
  quickAddText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  quoteCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quoteIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  quoteText: {
    flex: 1,
    fontSize: 15,
    fontStyle: 'italic',
    color: '#666',
    lineHeight: 22,
  },
  badgesSection: {
    padding: 20,
    paddingBottom: 10,
  },
  badgesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  celebrationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 40,
    alignItems: 'center',
    width: '80%',
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  celebrationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  celebrationSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  moodCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moodIcon: {
    fontSize: 50,
    marginRight: 15,
  },
  moodTextContainer: {
    flex: 1,
  },
  moodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  moodSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodPickerCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    width: '85%',
  },
  moodPickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  moodOption: {
    fontSize: 50,
    padding: 10,
  },
  selectedMoodEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  moodResponseText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#999',
  },
});