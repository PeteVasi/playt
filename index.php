<?
$indexFile = file_get_contents("index.html");

$repl = "<script>\n";
$repl .= "var playt = {};\n";
$repl .= "(function() {    playt.cards = [ ";

$allFiles = scandir("cards");
$first = true;
foreach($allFiles as $d)
{
    if(strncmp($d, ".", 1) != 0 && is_dir("cards/" . $d))
    {
        if(!$first)
            $repl .= ', ';
        $first = false;
        $repl .= '{ name: "' . $d . '", ';
        $repl .= 'include: 0, ';
        $repl .= 'cardBack: "cards/' . $d . '.jpg", ';
        $repl .= 'images: [ ';
        $allImages = scandir("cards/" . $d);
        $firstImg = true;
        foreach($allImages as $img)
        {
            if(strcasecmp(substr($img, -4), ".jpg") == 0 ||
               strcasecmp(substr($img, -4), ".png") == 0 ||
               strcasecmp(substr($img, -4), ".gif") == 0)
            {
                if(!$firstImg)
                    $repl .= ', ';
                $firstImg = false;
                $repl .= '"cards/' . $d . '/' . $img . '"'; 
            }
        }
        $repl .= ' ] } ';
    }
}

$repl .= " ]; ";
$repl .= "playt.dice = [ ";

$allFiles = scandir("dice");
$first = true;
foreach($allFiles as $d)
{
    if(strncmp($d, ".", 1) != 0 && is_dir("dice/" . $d))
    {
        if(!$first)
            $repl .= ', ';
        $first = false;
        $repl .= '{ name: "' . $d . '", ';
        $repl .= 'include: 0, ';
        $repl .= 'images: [ ';
        $allImages = scandir("dice/" . $d);
        $firstImg = true;
        foreach($allImages as $img)
        {
            if(strcasecmp(substr($img, -4), ".jpg") == 0 ||
               strcasecmp(substr($img, -4), ".png") == 0 ||
               strcasecmp(substr($img, -4), ".gif") == 0)
            {
                if(!$firstImg)
                    $repl .= ', ';
                $firstImg = false;
                $repl .= '"dice/' . $d . '/' . $img . '"'; 
            }
        }
        $repl .= ' ] } ';
    }
}

$repl .= " ]; ";
$repl .= " })();\n";
$repl .= "</script>";

echo(str_replace('<script src="playtStatic.js"></script>', $repl, $indexFile));
?>