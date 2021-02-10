import { IPoint } from 'markerjs2';
import { SvgHelper } from 'markerjs2';
import { RectangularBoxMarkerBase } from 'markerjs2';
import { Settings } from 'markerjs2';
import { MarkerBaseState } from 'markerjs2';
import { ColorPickerPanel } from 'markerjs2';
import { ToolboxPanel } from 'markerjs2';

import { RectangularBoxMarkerBaseState } from 'markerjs2';

/**
 * Represents TriangleMarker's state.
 */
export interface TriangleMarkerState extends RectangularBoxMarkerBaseState {
  /**
   * Triangle border stroke (line) color.
   */
  strokeColor: string;
}

export class TriangleMarker extends RectangularBoxMarkerBase {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'TriangleMarker';
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Triangle marker';
  /**
   * SVG icon markup displayed on toolbar buttons.
   */
  public static icon = `<svg viewBox="0 0 24 24"><path d="M12,2L1,21H23M12,6L19.53,19H4.47" /></svg>`;

  /**
   * Border color.
   */
  protected strokeColor = 'transparent';
  protected strokeWidth = 0;

  protected strokePanel: ColorPickerPanel;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   * @param overlayContainer - overlay HTML container to hold additional overlay elements while editing.
   * @param settings - settings object containing default markers settings.
   */
  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this.strokeColor = settings.defaultColor;
    this.strokeWidth = settings.defaultStrokeWidth;

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.createVisual = this.createVisual.bind(this);

    this.strokePanel = new ColorPickerPanel(
      'Line color',
      [...settings.defaultColorSet, 'transparent'],
      settings.defaultColor
    );
    this.strokePanel.onColorChanged = this.setStrokeColor;
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   * 
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || el === this.visual) {
      return true;
    } else {
      return false;
    }
  }


  private getPoints(): string {
    return `0,${this.height
    } ${this.width / 2},0 ${this.width},${this.height}`;
  }

  /**
   * Creates marker visual.
   */
  protected createVisual(): void {
    this.visual = SvgHelper.createPolygon(this.getPoints(), [
      ['stroke', this.strokeColor],
      ['fill', 'transparent'],
      ['stroke-width', this.strokeWidth.toString()]
    ]);
    this.addMarkerVisualToContainer(this.visual);
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);
    if (this.state === 'new') {
      this.createVisual();

      this.moveVisual(point);

      this._state = 'creating';
    }
  }

  /**
   * Resize marker based on current pointer coordinates and context.
   * @param point 
   */
  protected resize(point: IPoint): void {
    super.resize(point);
    this.setPoints();
  }

  /**
   * Sets marker's visual after manipulation.
   */
  protected setPoints(): void {
    super.setSize();
    SvgHelper.setAttributes(this.visual, [
      ['points', this.getPoints()]
    ]);
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   * 
   * @param point - event coordinates.
   */
  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.setPoints();
  }

  /**
   * Sets marker's line color.
   * @param color - new line color.
   */
  protected setStrokeColor(color: string): void {
    this.strokeColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke', this.strokeColor]]);
    }
  }

  /**
   * Returns the list of toolbox panels for this marker type.
   */
  public get toolboxPanels(): ToolboxPanel[] {
    return [this.strokePanel];
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): TriangleMarkerState {
    const result: TriangleMarkerState = Object.assign({
      strokeColor: this.strokeColor
    }, super.getState());
    result.typeName = TriangleMarker.typeName;

    return result;
  }

  /**
   * Restores previously saved marker state.
   * 
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    const rectState = state as TriangleMarkerState;
    this.strokeColor = rectState.strokeColor;

    this.createVisual();
    super.restoreState(state);
    this.setPoints();
  }

  /**
   * Scales marker. Used after the image resize.
   * 
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.setPoints();
  }
}
