import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export const TutorialMode = {
    NONE: 0,
    CTA: 1,
    CTAs: 2,
};

export class Tutorial extends Scene {
    handTween;
    f_hand;
    target;
    mode;

    constructor() {
        super('Tutorial');
    }

    create() {

        this.f_hand = this.add.image(65, 65, 'debugBtn').setDepth(100).setOrigin(0.1);

        let name = this.add.text(320, 200, 'Tutorial', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);

        this.f_icon.setInteractive();
        this.f_DL.setInteractive();
        this.f_DL.on('pointerdown', () => this.redirect(this.f_DL));
        this.f_icon.on('pointerdown', () => this.redirect(this.f_icon));

        EventBus.emit('current-scene-ready', this);
    }

    stopHand(alphaOut = true, nullify = true) {
        if (this.handTween) {
            this.handTween.stop();
            this.handTween = null;
        }

        this.f_hand.scale = 1;

        if (alphaOut) {
            this.tweens.add({
                targets: this.f_hand,
                alpha: 0,
                duration: 300
            });
        }

        if (nullify) {
            this.target = null;
            this.mode = TutorialMode.NONE;
        }
    }

    setMode(target, mode = TutorialMode.CTA) {
        this.target = target;
        this.mode = mode;
    }

    queueHand(a = 1, dur = 300, del = 3700) {
        this.stopHand(false, false);
        this.f_hand.setAlpha(0);

        this.handTween = this.tweens.add({
            targets: this.f_hand,
            // x: { value: this.target.x, duration, ease: 'Sine.easeInOut' },
            // y: { value: this.target.y, duration, ease: 'Sine.easeInOut' },
            alpha: a,
            duration: dur,
            delay: del,
            onComplete: this.startTutorial,
            onCompleteScope: this,
        });
    }

    startTutorial(target) {
        if (target)
            this.target = target;
        if (!this.target) {
            console.warn('No target set for tutorial');
            return;
        }
        let speed = 1000;

        switch (this.mode) {
            case TutorialMode.NONE:
                // Your logic for no tutorial
                break;
            case TutorialMode.CTAs:

                break;
            default:
                let { tx, ty } = this.target.getWorldTransformMatrix();
                this.f_hand.setPosition(tx, ty);

                this.tweens.add({
                    targets: this.f_hand,
                    scale: '-=.1',
                    duration: speed / 6,
                    // delay: speed / 3,
                    ease: 'Quart',
                    repeat: -1,
                    repeatDelay: speed / 3,
                    yoyo: true,
                    // hold: speed / 3,
                    onYoyo: () => {
                        this.tweens.add({
                            targets: this.target,
                            scale: '-=.1',
                            duration: speed / 3,
                            delay: speed / 8,
                            ease: 'Quart',
                            loop: -1,
                        })
                    }
                })
        }
    }

    moveLogo(reactCallback) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            }
            else {
                this.logoTween.play();
            }
        }
        else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback) {
                        reactCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }

}
