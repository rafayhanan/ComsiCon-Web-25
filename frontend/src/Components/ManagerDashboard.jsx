import React, { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export default function ManagerDashboard() {
  const [teams, setTeams] = useState([
    { id: 1, name: 'Development Team', members: 8, tasks: 12 },
    { id: 2, name: 'Design Team', members: 5, tasks: 7 },
    { id: 3, name: 'Marketing Team', members: 6, tasks: 9 },
    { id: 4, name: 'QA Team', members: 4, tasks: 15 },
  ]);

  const [teamMembers, setTeamMembers] = useState({
    1: [
      { id: 101, name: 'John Doe' },
      { id: 102, name: 'Jane Smith' },
      { id: 103, name: 'Robert Johnson' },
      { id: 104, name: 'Emily Davis' },
    ],
    2: [
      { id: 201, name: 'Michael Brown' },
      { id: 202, name: 'Sarah Wilson' },
      { id: 203, name: 'David Lee' },
    ],
    3: [
      { id: 301, name: 'Lisa Garcia' },
      { id: 302, name: 'Kevin Martin' },
      { id: 303, name: 'Amanda White' },
    ],
    4: [
      { id: 401, name: 'Thomas Anderson' },
      { id: 402, name: 'Jessica Taylor' },
      { id: 403, name: 'Ryan Miller' },
    ],
  });

  const [deadline, setDeadline] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    title: '',
    description: '',
    assignedUserIds: [],
    priority: ''
  });
  
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [availableMembers, setAvailableMembers] = useState([]);

  useEffect(() => {
    if (formData.projectId) {
      setAvailableMembers(teamMembers[formData.projectId] || []);
    } else {
      setAvailableMembers([]);
    }
  }, [formData.projectId]);

  const handleCreateTask = async () => {
    try {
      const taskData = {
        projectId: formData.projectId,
        title: formData.title,
        description: formData.description,
        assignedUserIds: formData.assignedUserIds,
        deadline: deadline,
        priority: formData.priority
      };
      
      console.log('Creating task:', taskData);
      
      // Make API call to create task
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Task created successfully:', result);
        
        // Update UI or show success message
        // For now, we'll just reset the form
        setOpen(false);
        resetForm();
      } else {
        const error = await response.json();
        console.error('Failed to create task:', error);
        // Handle error (show error message to user)
      }
    } catch (error) {
      console.error('Error creating task:', error);
      // Handle error (show error message to user)
    }
  };
  
  const resetForm = () => {
    setFormData({
      projectId: '',
      title: '',
      description: '',
      assignedUserIds: [],
      priority: ''
    });
    setDeadline(null);
  };
  
  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    console.log(`Navigating to team details for: ${team.name}`);
    // In a real application, you would navigate to the team details page
  };

  const handleMemberChange = (userId) => {
    setFormData(prev => {
      const currentAssigned = [...prev.assignedUserIds];
      if (currentAssigned.includes(userId)) {
        return {
          ...prev,
          assignedUserIds: currentAssigned.filter(id => id !== userId)
        };
      } else {
        return {
          ...prev,
          assignedUserIds: [...currentAssigned, userId]
        };
      }
    });
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
                <Label htmlFor="title">Task Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter task title" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Task description" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="team">Team (Project)</Label>
                <Select onValueChange={(value) => setFormData({...formData, projectId: value})}>
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
              
              {formData.projectId && (
                <div className="grid gap-2">
                  <Label>Assign Team Members</Label>
                  <div className="border rounded-md p-4 max-h-40 overflow-y-auto">
                    {availableMembers.length > 0 ? (
                      availableMembers.map(member => (
                        <div key={member.id} className="flex items-center space-x-2 mb-2">
                          <Checkbox 
                            id={`member-${member.id}`} 
                            checked={formData.assignedUserIds.includes(member.id)}
                            onCheckedChange={() => handleMemberChange(member.id)}
                          />
                          <Label 
                            htmlFor={`member-${member.id}`}
                            className="cursor-pointer"
                          >
                            {member.name}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Select a team to see members</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="grid gap-2">
                <Label>Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deadline && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
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
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
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
                  setFormData({...formData, projectId: team.id.toString()});
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