
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import Matter from 'matter-js';

const App = () => {
  const physicsEngine = useRef(Matter.Engine.create());
  const [ball, setBall] = useState(null);

  useEffect(() => {
    const engine = physicsEngine.current;
    const world = engine.world;

    const ground = Matter.Bodies.rectangle(200, 600, 400, 10, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(0, 300, 10, 600, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(400, 300, 10, 600, { isStatic: true });

    Matter.World.add(world, [ground, leftWall, rightWall]);

    Matter.Events.on(engine, 'afterUpdate', () => {
      setBall(ball => {
        if (ball) {
          return {
            ...ball,
            position: ball.position,
            angle: ball.angle,
          };
        }
        return null;
      });
    });

    Matter.Runner.run(engine);

    return () => {
      Matter.Events.off(engine, 'afterUpdate');
      Matter.World.clear(world);
      Matter.Engine.clear(engine);
    };
  }, []);

  const handleThrowBall = () => {
    const engine = physicsEngine.current;

    const newBall = Matter.Bodies.circle(200, 100, 20);
    Matter.World.add(engine.world, newBall);
    Matter.Body.applyForce(newBall, { x: newBall.position.x, y: newBall.position.y }, { x: 0.01, y: -0.01 });

    setBall(newBall);
  };

  return (
    <View style={styles.container}>
      <Button title="Throw Ball" onPress={handleThrowBall} />
      {ball && (
        <View style={[styles.ball, { left: ball.position.x - 20, top: ball.position.y - 20 }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ball: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'red',
  },
});

export default App;
