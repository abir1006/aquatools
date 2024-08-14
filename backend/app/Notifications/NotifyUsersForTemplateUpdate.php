<?php

namespace App\Notifications;

use App\Models\Template;
use App\Models\TemplateShare;
use App\Models\Tool;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotifyUsersForTemplateUpdate extends Notification implements ShouldQueue
{
    use Queueable;

    private $template;

    /**
     * Create a new notification instance.
     *
     * @param Template $template
     */
    public function __construct(Template $template)
    {
        //
        $this->template = $template;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }


    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $user = User::find($this->template->updated_by);
        $model_name = Tool::where('id', $this->template->tool_id)->pluck('name');

        return [
            'user' => $user,
            'name' => $this->template->name,
            'created_by' => $this->template->user_id,
            'updated_by' => $this->template->updated_by,
            'model_name' => $model_name[0]
        ];
    }
}
