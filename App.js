import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const App = () => {
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);

  const handleThrowStone = () => {
    const damage = Math.floor(Math.random() * 20) + 1; // 随机造成1到20点伤害
    const attacker = Math.random() < 0.5 ? 'Player 1' : 'Player 2'; // 随机选择攻击者
    if (attacker === 'Player 1') {
      setPlayer2Health(prevHealth => Math.max(0, prevHealth - damage));
    } else {
      setPlayer1Health(prevHealth => Math.max(0, prevHealth - damage));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        <Text style={styles.playerText}>Player 1 Health: {player1Health}</Text>
      </View>
      <View style={styles.playerContainer}>
        <Text style={styles.playerText}>Player 2 Health: {player2Health}</Text>
      </View>
      <Button title="Throw Stone" onPress={handleThrowStone} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerContainer: {
    marginVertical: 10,
  },
  playerText: {
    fontSize: 20,
  },
});

export default App;
