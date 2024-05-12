
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

      //讲物理引擎得到的位置和角度保存到状态管理器中。这样可以稳定的被css找到。
      //位置更新之后，会set值，在之后才渲染组件。这个时候已经保存状态了。
      setBall(ball => {
        if (ball) {
          return {
            ...ball,
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

    //在系统中移除旧的球
    const ballToRemove = engine.world.bodies.find(body => body.label === 'ball1');
    if(ballToRemove){
        Matter.World.remove(engine.world, ballToRemove);
    }

    //添加新球并赋力
    const newBall = Matter.Bodies.circle(200, 100, 20, { label: 'ball1' });
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
