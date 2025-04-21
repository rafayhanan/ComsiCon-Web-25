import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function ManagerDashboard() {
  const [teams, setTeams] = useState([
    { id: 1, name: 'Development Team', members: 8, tasks: 12 },
    { id: 2, name: 'Design Team', members: 5, tasks: 7 },
    { id: 3, name: 'Marketing Team', members: 6, tasks: 9 },
    { id: 4, name: 'QA Team', members: 4, tasks: 15 },
  ]);

  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    taskHeader: '',
    priority: '',
    teamId: null
  });
  
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleCreateTask = () => {
    console.log('Creating task:', { ...formData, dueDate: date });
    setOpen(false);
    // Reset form data
    setFormData({ taskHeader: '', priority: '', teamId: null });
    setDate(null);
  };
  
  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    console.log(`Navigating to team details for: ${team.name}`);
    // In a real application, you would navigate to the team details page
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-gray-500">Manage your teams and tasks</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Create Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task for one of your teams.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="taskHeader">Task Header</Label>
                <Input 
                  id="taskHeader" 
                  placeholder="Enter task title" 
                  value={formData.taskHeader}
                  onChange={(e) => setFormData({...formData, taskHeader: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="team">Team</Label>
                <Select onValueChange={(value) => setFormData({...formData, teamId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Card 
              key={team.id} 
              className="cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => handleTeamClick(team)}
            >
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>{team.members} members</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{team.tasks} active tasks</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  setFormData({...formData, teamId: team.id.toString()});
                  setOpen(true);
                }}>
                  Add Task
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {selectedTeam && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{selectedTeam.name} Details</h2>
            <Button variant="outline" onClick={() => setSelectedTeam(null)}>
              Back to All Teams
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{selectedTeam.name}</CardTitle>
              <CardDescription>{selectedTeam.members} team members</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is where you would display detailed information about the selected team, including team members, current tasks, and performance metrics.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}