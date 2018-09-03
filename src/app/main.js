import '../lib/kontra';
import OG from './gameInfo';
import { levels } from './levels';

kontra.init();

const c = kontra.context;
c.font = '38px Courier';
c.fillText('Please turn computers off', 10, 50);
c.fillText('before they are infected', 10, 120);
c.fillText('Click anywhere to start', 35, 300);
c.strokeStyle = 'transparent';
kontra.canvas.onclick = start;


const c1 = 'iVBORw0KGgoAAAANSUhEUgAAACgAAAAjCAYAAADmOUiuAAABUUlEQVRYR2NkwAGmT877j0uOFuKZ' +
  'uZMYsZmLVRDmuNRkL1q4BcPM2XO3gcWwORKnA+nlOJhrQY6kigPjkrooCtVF88qw6qeKA0GOu3Pv' +
  'C9wCFRUVOHvXrl1EOdzNRY8BmyMpdiDMcciOwuYiYhyKzZF0cyDM0fgcSjMHMjBJEBWNIEWD3oH4' +
  'HDkoQnDUgegFNbj8IyENjobgaAiiVXlUKaiHVRockIIa1FAgVBcPaFVHjAMHrLEACplB3dyCRd2g' +
  'abCCHESvZj/JfRKQ4wZ1rw4WnTBHHj56heh2ICkKba11cPbmYOYw4gopXI66c+cpKW7AUKuiIo1V' +
  'P8yx6JI4HYiskNYhiM/HYAfSKzOQGvSgzDPqQFJDDVn90AxBWKGJ7nNqpFOY2TCziOGjpEFsjkPO' +
  'wbjGVYiNRpD5IPNg5hDDH80kxIYuNnXwTEKJIbTWCwAtNHuwokUhvgAAAABJRU5ErkJggg';
const c2 = 'iVBORw0KGgoAAAANSUhEUgAAACgAAAAjCAYAAADmOUiuAAABVUlEQVRYR+2XvQqDMBDH67s4ufkk' +
  'hY5OrgXByadwEoSuLjoWHFyFPoGbk+/SctIT0UtMiMa0xMl83OWXf5LLxbkwvjRN36y2I+qTJHEo' +
  'v2QlwoVheATLymdRFGMdBckE1AWHtAC5C2D9rJVUvd6upP0ugACXP/JpAM/zpv++74XAo3t0oSCV' +
  'ARFuDkURiYBSkNoAEZoHehhg+2qFlhE6GQ/IgzRCQQu4DNRwimX2oFXQKri48nYJ1H+1B08J1JAo' +
  'bN3Fp151IoCnJQugDGzksizNTLeQypiEFYB0pf3SbxKAM/pVh8sZBIGWp2dVVeTjDTgcnlJd1zET' +
  '1GEYhJNX6Oi6LrO/7/vMNi4gZcWDFiHmwVD2I6CuwyAygXkfODwWUFa131cwjmNy0lmWqYgx2qJv' +
  '9LVVXu1BCm4eTpqmUYIE/+AP/WyV7SFRkvubPUkHatVBZe0/ONKXEyCY6tAAAAAASUVORK5CYII';
const c3 = 'iVBORw0KGgoAAAANSUhEUgAAACgAAAAjCAYAAADmOUiuAAABaklEQVRYR+2YOw6DMAyGw2XatQti' +
  '4SwIscHEUZhg5ywsiKULQ3uZVkZ1BQEaOw+garNBHOfL7zztCankef6Q/1G+i6LwKHZcm4lTgEvT' +
  'lOWjqqrB3jmgLlwQBKJt2x8HNFEPwutcwUMDmsI5V1B3W4HFgcVpiL9CQe7elyQJa680MfZ0FATA' +
  'pmlM+iW1DcNQTACzLPvYsCzLoR4BwYGrAgLMAKmdjQHjOH436/t+1UXXdYt1vu/P/oOtdUAdOJkM' +
  'YTcFXFNuTWqAtA64ph4XDqAPD4jKWp2DSwrqqDcO+x/w8ApCuEwgrYYYYGzPw00AdVR0ss3g6jPd' +
  'D52eJCaQ8nls9SShXjC4dlbmILdTrr3RdYvbma691o0a0h34aKI8mMa3dmjLSZNMAKMoEnVdKweL' +
  'gBQ4cGYNUEn2MtgN8HI6i+v9puTkZrR2URBGQZ1LuwBS4MZZC3x7o/rUAQ4JTG76gwqnSghQVvQT' +
  'R9vbQ8Z7rhUAAAAASUVORK5CYII';

function start() {
  kontra.canvas.onclick = () => {};
  let p = kontra.assets.loadB64({ c1, c2, c3 });
  p.then(() => {
    new OG();
    let loop = kontra.gameLoop({
      update() {
        kontra.pointer.track(OG.spArr);
        s.value = OG.score;
        OG.spArr.map(s => s.update());

        const end = OG.checkEnd();

        if (end && !levels[OG.level + 1]) {
          loop.stop();
          const popup = document.getElementById('end_game');
          const total = OG.numTotal;
          const won = OG.wins;
          const ratio = won / total;
          popup.innerHTML = `<p>Thank you for ${ratio < 0.5 ? 'trying to save' : 'saving'} us.</p>`;
          popup.innerHTML += `<p>Of ${total} computers<br/> you saved ${won}.`;
          popup.innerHTML += `<br />That's a ${Math.round(ratio * 100)}% success rate.`;
          popup.innerHTML += `<br/><br /><span onclick="javascript:window.location.reload()">Play again?</span>`;
          popup.style.display = 'block';
          return;
        }

        if (end && levels[OG.level + 1]) {
          OG.nextLevel();
        }
      },
      render() {
        OG.spArr.map(a => a.render());
      },
      fps: OG.fps
    });

    loop.start();

    OG.gameLoop = loop;
  });
}
