"use client";

import React, { useEffect, useMemo, useState } from "react";

type Vector = {
  x: number;
  y: number;
};

type FlockMember = {
  position: Vector;
  direction: Vector;
  lastChange: number;
};

type FlockingComponentProps = {
  inputComponent?: React.ReactNode;
  amount?: number;
  velocity?: number;
  turnRate?: number;
};

const FlockingComponent: React.FC<FlockingComponentProps> = ({
  inputComponent: InputComponent,
  amount,
  velocity,
  turnRate,
}) => {
  const FlockSubject = useMemo(() => {
    if (InputComponent) return () => InputComponent;
    const DefaultFlockSubject = () => <div className="h-4 w-4">🫥</div>;
    DefaultFlockSubject.displayName = "FlockSubject";
    return DefaultFlockSubject;
  }, [InputComponent]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  const [flock, setFlock] = useState<FlockMember[]>([]);

  // Utility to generate random positions and directions
  const generateRandomVector = () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  });

  // Initialize flock
  useEffect(() => {
    const initialFlock = Array.from({ length: amount ?? 10 }, () => ({
      position: generateRandomVector(),
      direction: generateRandomVector(),
      lastChange: 0, // last change in direction (positive is right, negative is left, 0 is straight)
    }));

    setFlock(initialFlock);
  }, [amount]);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFlock((currentFlock) => {
        // calculate the average direction of the flock
        const averageDirection = currentFlock.reduce(
          (acc, member) => ({
            x: acc.x + member.direction.x,
            y: acc.y + member.direction.y,
          }),
          { x: 0, y: 0 },
        );

        // calculate the center of the flock
        const center = currentFlock.reduce(
          (acc, member) => ({
            x: acc.x + member.position.x,
            y: acc.y + member.position.y,
          }),
          { x: 0, y: 0 },
        );

        // const center = {
        //   x: mousePosition.x,
        //   y: mousePosition.y,
        // };

        return currentFlock.map((member) => {
          // Calculate the best new direction for the member
          // Highest priority is to avoid collisions with other members
          // Second priority is to avoid the edge of the screen
          // Third priority is to turn towards the average direction of the flock
          // Fourth priority is to turn towards the center of the flock

          let newDirection = member.direction;

          /***** Collision avoidance *****/
          // filter the flock to only include members that are close enough to collide (50 pixels)
          const nearbyMembers = currentFlock.filter(
            (otherMember) =>
              otherMember !== member &&
              Math.hypot(
                member.position.x - otherMember.position.x,
                member.position.y - otherMember.position.y,
              ) < 50,
          );

          for (const otherMember of nearbyMembers) {
            // turn away from other members preferring to continue turning in the same direction based on lastChange
            const angle = Math.atan2(
              otherMember.position.y - member.position.y,
              otherMember.position.x - member.position.x,
            );
            const newAngle = angle + Math.PI * (turnRate ?? 0.01);
            newDirection = {
              x: Math.cos(newAngle),
              y: Math.sin(newAngle),
            };
          }

          /****** Adjust direction based on distance from center *****/
          const distanceFromCenter = Math.hypot(
            member.position.x - center.x / currentFlock.length,
            member.position.y - center.y / currentFlock.length,
          );
          if (distanceFromCenter > 50) {
            // turn towards the center of the flock and update the direction
            const angle = Math.atan2(
              center.y / currentFlock.length - member.position.y,
              center.x / currentFlock.length - member.position.x,
            );
            const newAngle = angle + Math.PI * (turnRate ?? 0.01);
            newDirection = {
              x: Math.cos(newAngle),
              y: Math.sin(newAngle),
            };
          } else if (distanceFromCenter < 50) {
            // too close to center, turn away
            const angle = Math.atan2(member.direction.y, member.direction.x);
            const newAngle = angle + Math.PI * (turnRate ?? 0.01);
            newDirection = {
              x: Math.cos(newAngle),
              y: Math.sin(newAngle),
            };
          }

          // Adjust direction if too close to edge
          if (
            member.position.x < 10 ||
            member.position.y < 10 ||
            member.position.x > window.innerWidth - 10 ||
            member.position.y > window.innerHeight - 10
          ) {
            newDirection = {
              x: (window.innerWidth / 2 - member.position.x) / 100,
              y: (window.innerHeight / 2 - member.position.y) / 100,
            };
          }

          // Move member
          return {
            position: {
              x: member.position.x + newDirection.x * (velocity ?? 1),
              y: member.position.y + newDirection.y * (velocity ?? 1),
            },
            direction: newDirection,
          };
        });
      });
    }, 1000 / 60); // 60 fps

    return () => clearInterval(interval);
  }, [velocity, turnRate, amount]);

  // Render flock members
  return (
    <>
      {flock.map((member, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: member.position.x,
            top: member.position.y,
            // Additional styles can be applied to rotate the component based on direction, etc.
          }}
        >
          <FlockSubject />
        </div>
      ))}
    </>
  );
};

export default FlockingComponent;
export { FlockingComponent };
