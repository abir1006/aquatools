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
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TemplateShared implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $templateShare;

    /**
     * Create a new event instance.
     *
     * @param TemplateShare $templateShare
     */
    public function __construct(TemplateShare $templateShare)
    {
        $this->templateShare = $templateShare;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('notification.' . $this->templateShare->user_id);
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        $template = Template::select('id', 'name', 'tool_id', 'user_id')->with('tool')->where('id', $this->templateShare->template_id)->get();
        $user = User::find($this->templateShare->shared_by);
        return [
            'template' => $template,
            'user' => $user
        ];
    }
}
