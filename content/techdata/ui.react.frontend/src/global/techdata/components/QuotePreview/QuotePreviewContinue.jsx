import React, {useState} from 'react';
import Button from '../Widgets/Button';
import Link from '../Widgets/Link';

const handleClick = e => {
    // subject to change
    e.preventDefault();
    console.log('clicked btn');
}

function QuotePreviewContinue({gridProps}) {
    const [isDefault, setIsDefault] = useState(false);

    const handleInputChange = () => {
        setIsDefault(!isDefault);
    }

    return (
        <div class="cmp-qp-continue">
            <Button btnClass={'cmp-qp-continue__btn'} disabled={false} onClick={handleClick}>
                {gridProps.confirmButtonLabel}
            </Button>
            <div className="cmp-qp-continue__checkbox">
                <input type="checkbox" name="make-default" checked={isDefault} onChange={handleInputChange} />
                <label for="make-default">{gridProps.defaultChoiceLabel}</label>
            </div>
            <Link href="#" variant={'cmp-qp-continue__link'} underline={'always'}>{gridProps.continueWithStandardPriceLabel}</Link>
        </div>
    )
}

export default QuotePreviewContinue;