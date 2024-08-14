<?php

namespace App\Events;

use App\Models\Template;
use App\Models\TemplateShare;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TemplateUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $template;

    /**
     * Create a new event instance.
     *
     * @param Template $template
     */
    public function __construct(Template $template)
    {
        $this->template = $template;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        $sharedUsers = TemplateShare::where('template_id', $this->template->id)->get(['user_id']);
        $channels = [];
        foreach ($sharedUsers as $user) {
            $channels[] = new PrivateChannel('notification.' . $user['user_id']);
        }

        if ($this->template->updated_by != $this->template->user_id) {
            $channels[] = new PrivateChannel('notification.' . $this->template->user_id);
        }

        return $channels;
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        $sharedUsers = TemplateShare::where('template_id', $this->template->id)->get(['user_id']);
        $user = User::find($this->template->user_id);
        $updatedUser = null;
        if ($this->template->updated_by) {
            $updatedUser = User::find($this->template->updated_by);
        }

        unset($this->template->template_data);
        return [
            'user' => $user,
            'updatedUser' => $updatedUser,
            'template' => $this->template,
            'sharedUsers' => $sharedUsers
        ];
    }
}
