import { Scene } from 'phaser';
// import pack from 'public/assets/pack.json’;

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(320, 569, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(320, 769, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(320-230, 769, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        // this.load.setPath('assets');
        this.load.pack('playableAssets', 'assets/assetsPack.json');
        // console.log(this.load.pack)

        // this.load.image('logo', 'BaseTemplate/logo.png');
        // this.load.image('star', 'BaseTemplate/star.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
        console.log(Phaser.Cache.image)
    }
}
