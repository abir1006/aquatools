<?php

namespace App\Notifications;

use App\Models\Material;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MaterialAdded extends Notification
{
    use Queueable;

    private $material;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Material $material)
    {
        $this->material = $material;
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
        return [

            'id' => $this->material->id,
            'title' => $this->material->title,
        ];
    }
}
