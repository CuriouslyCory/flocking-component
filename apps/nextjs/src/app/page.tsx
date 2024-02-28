import { FlockingComponent } from "@curiouslycory/flocking-component";
import { Button } from "@curiouslycory/ui/button";

export const runtime = "edge";

export default async function HomePage() {
  return (
    <main className="container h-screen py-16">
      <FlockingComponent className="" />
      <div className="flex flex-col items-center justify-center gap-4">
        <h1>hello world</h1>
        <Button>Click me</Button>
      </div>
    </main>
  );
}
