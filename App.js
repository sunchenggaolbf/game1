import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import Matter from 'matter-js';

const App = () => {
  const physicsEngine = useRef(Matter.Engine.create());
  const [ball, setBall] = useState(null);
  const [ballColor, setBallColor] = useState('red');

  useEffect(() => {
    const engine = physicsEngine.current;
    const world = engine.world;
    const ground = Matter.Bodies.rectangle(200, 600, 400, 10, { isStatic: true, label: 'ground' });
    const leftWall = Matter.Bodies.rectangle(0, 300, 10, 600, { isStatic: true, label: 'leftWall' });
    const rightWall = Matter.Bodies.rectangle(400, 300, 10, 600, { isStatic: true, label: 'rightWall' });

    Matter.World.add(world, [ground, leftWall, rightWall]);

    // 不断更新小球位置状态监听xxxxxxxxxxx
    Matter.Events.on(engine, 'afterUpdate', () => {
      setBall(ball => {
        if (ball) {
          return {
            ...ball,
          };
        }
        return null;
      });
    });

    // 碰撞检测监听
    Matter.Events.on(engine, 'collisionStart', event => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        if ((bodyA.label === 'ball1' && bodyB.label === 'ground') || (bodyA.label === 'ground' && bodyB.label === 'ball1')) {
          console.log('Ball collided with ground!');
          setBallColor('green');
        } else{
          setBallColor('red');
        }
        // 这里可以添加更多的碰撞检测逻辑aaa
      });
    });

    Matter.Runner.run(engine);

    return () => {
      Matter.Events.off(engine, 'afterUpdate');
      Matter.Events.off(engine, 'collisionStart');
      Matter.World.clear(world);
      Matter.Engine.clear(engine);
    };
  }, []);

  const handleThrowBall = () => {
    const engine = physicsEngine.current;

    const ballToRemove = engine.world.bodies.find(body => body.label === 'ball1');
    if (ballToRemove) {
      Matter.World.remove(engine.world, ballToRemove);
      setBallColor('red');
    }

    const newBall = Matter.Bodies.circle(200, 100, 20, { label: 'ball1' });
    Matter.World.add(engine.world, newBall);
    Matter.Body.applyForce(newBall, { x: newBall.position.x, y: newBall.position.y }, { x: 0.01, y: -0.01 });

    setBall(newBall);

    
  };

  return (
    <View style={styles.container}>
      <Button title="Throw Ball" onPress={handleThrowBall} />
      {ball && (
        <View style={[styles.ball, { left: ball.position.x - 20, top: ball.position.y - 20, backgroundColor:ballColor }]} />
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
  },
});

export default App;
