import React from "react";

type FlockingComponentProps = {
  flockObject?: React.ReactNode;
  number?: number;
};

const FlockingComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FlockingComponentProps
>(({ className, ...props }, ref) => {
  //const num = props.number ?? 5;
  const flockSubject = props.flockObject ?? (
    <div className="h-4 w-4 bg-red-400">🫥</div>
  );

  return (
    <div
      ref={ref}
      className="absolute left-0 top-0 min-h-screen w-full bg-red-500"
    >
      <FlockingSubject subject={flockSubject} className={className} />
    </div>
  );
});

FlockingComponent.displayName = "FlockingComponent";

type FlockingSubjectProps = {
  subject: React.ReactNode;
};

const FlockingSubject = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FlockingSubjectProps
>(({ ...props }, ref) => {
  return <div ref={ref}>{props.subject}</div>;
});
FlockingSubject.displayName = "FlockingSubject";

export default FlockingComponent;
export { FlockingComponent, FlockingSubject };
export type { FlockingComponentProps, FlockingSubjectProps };
