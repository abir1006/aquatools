<?php

namespace App\Notifications;

use App\Models\Template;
use App\Models\Tool;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotifyUsersForTemplateShared extends Notification implements ShouldQueue
{
    use Queueable;

    private $template;
    private $user;

    /**
     * Create a new notification instance.
     *
     * @param Template $template
     * @param User $user
     */
    public function __construct(Template $template, User $user)
    {
        //
        $this->template = $template;
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }


    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $model_name = Tool::where('id', $this->template->tool_id)->pluck('name');
        return [
            'user' => $this->user,
            'name' => $this->template->name,
            'model_name' => $model_name[0]
        ];
    }
}
