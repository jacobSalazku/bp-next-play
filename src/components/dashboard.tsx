import { BookOpen, Calendar, Play, User } from "lucide-react";
import { Button } from "./foundation/button/button";
import { Card, CardContent } from "./foundation/card";

const DashBoardBlock = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Welcome back!</h1>
        <p className="text-gray-500">
          Here is whatis happening with your team.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Next Game</h2>
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-gray-600">June 14th, 7:00PM</p>
            <p className="font-medium text-gray-900">vs Wildcats</p>
            <Button variant="default" className="mt-2">
              View Schedule
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Top Performer</h2>
              <User className="h-5 w-5 text-blue-500" />
            </div>
            <p className="font-medium text-gray-900">Alex Johnson</p>
            <p className="text-gray-600">22 pts • 9 rebounds • 5 assists</p>
            <Button variant="secondary" className="mt-2">
              View Stats
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Playbook Highlight</h2>
              <BookOpen className="h-5 w-5 text-green-500" />
            </div>
            <p className="font-medium text-gray-900">Full Court Press</p>
            <p className="text-sm text-gray-600">
              High-intensity defensive play.
            </p>
            <Button variant="ghost" className="mt-2 text-green-600">
              Open Playbook
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <h2 className="mb-4 text-xl font-semibold">Upcoming Events</h2>
        <ul className="space-y-3">
          <li className="flex justify-between border-b pb-2">
            <span>Practice Session</span>
            <span className="text-gray-500">June 11, 5:00 PM</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>Team Meeting</span>
            <span className="text-gray-500">June 12, 6:00 PM</span>
          </li>
          <li className="flex justify-between">
            <span>Travel to Tournament</span>
            <span className="text-gray-500">June 13, 2:00 PM</span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Button variant="outline" className="flex w-full items-center gap-2">
          <User className="h-5 w-5" />
          Manage Players
        </Button>
        <Button variant="outline" className="flex w-full items-center gap-2">
          <Calendar className="h-5 w-5" />
          View Schedule
        </Button>
        <Button variant="outline" className="flex w-full items-center gap-2">
          <Play className="h-5 w-5" />
          Watch Replays
        </Button>
        <Button variant="outline" className="flex w-full items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Browse Playbook
        </Button>
      </div>
    </div>
  );
};

export default DashBoardBlock;
